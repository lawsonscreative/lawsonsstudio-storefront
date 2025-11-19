import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { createInkthreadableOrder } from '@/lib/inkthreadable/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get metadata
      const brandId = session.metadata?.brand_id;
      const orderId = session.metadata?.order_id;

      if (!brandId || !orderId) {
        console.error('Missing metadata in session:', session.id);
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      const supabase = getSupabaseAdminClient();

      // Update order to paid
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError || !order) {
        console.error('Failed to update order:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }

      // Get order items with Inkthreadable IDs
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError || !orderItems || orderItems.length === 0) {
        console.error('Failed to get order items:', itemsError);
        return NextResponse.json(
          { error: 'Failed to get order items' },
          { status: 500 }
        );
      }

      // Create Inkthreadable order
      const inkthreadableResponse = await createInkthreadableOrder({
        recipient_name: order.shipping_recipient_name,
        line1: order.shipping_line1,
        line2: order.shipping_line2 || undefined,
        city: order.shipping_city,
        county: order.shipping_county || undefined,
        postcode: order.shipping_postcode,
        country: order.shipping_country,
        phone: order.shipping_phone || undefined,
        items: orderItems.map((item) => ({
          product_id: item.inkthreadable_product_id!,
          variant_id: item.inkthreadable_variant_id!,
          quantity: item.quantity,
        })),
        reference: order.id,
      });

      if (inkthreadableResponse.success) {
        // Update order with Inkthreadable ID
        await supabase
          .from('orders')
          .update({
            status: 'in_production',
            inkthreadable_order_id: inkthreadableResponse.order_id,
            inkthreadable_status: 'submitted',
          })
          .eq('id', orderId);

        console.log(
          `Order ${orderId} sent to Inkthreadable: ${inkthreadableResponse.order_id}`
        );
      } else {
        console.error(
          'Failed to create Inkthreadable order:',
          inkthreadableResponse.message
        );
        // Order stays as 'paid' - manual intervention required
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
