import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLawsonsStudioBrand } from '@/lib/brand/resolver';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, shipping } = body;

    if (!items || !customer || !shipping) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get brand
    const brand = await getLawsonsStudioBrand();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Get Supabase admin client
    const supabase = getSupabaseAdminClient();

    // Validate cart items against database
    const variantIds = items.map((item: any) => item.product_variant_id);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*, product:products(*)')
      .in('id', variantIds)
      .eq('is_active', true);

    if (variantsError || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Calculate totals and create line items
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const variant = variants.find((v: any) => v.id === item.product_variant_id);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.product_variant_id} not found` },
          { status: 400 }
        );
      }

      subtotal += variant.price_amount * item.quantity;

      lineItems.push({
        price_data: {
          currency: variant.currency.toLowerCase(),
          unit_amount: variant.price_amount,
          product_data: {
            name: `${variant.product.name} - ${variant.name}`,
            images: variant.product.primary_image_url
              ? [variant.product.primary_image_url]
              : [],
          },
        },
        quantity: item.quantity,
      });
    }

    // Create draft order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        brand_id: brand.id,
        status: 'pending_payment',
        customer_email: customer.email,
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_phone: customer.phone,
        shipping_recipient_name: shipping.recipient_name,
        shipping_line1: shipping.line1,
        shipping_line2: shipping.line2,
        shipping_city: shipping.city,
        shipping_county: shipping.county,
        shipping_postcode: shipping.postcode,
        shipping_country: shipping.country,
        shipping_phone: shipping.phone,
        subtotal_amount: subtotal,
        shipping_amount: 0, // TODO: Calculate shipping
        tax_amount: 0, // TODO: Calculate tax
        total_amount: subtotal,
        currency: brand.currency,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => {
      const variant = variants.find((v: any) => v.id === item.product_variant_id);
      return {
        order_id: order.id,
        product_id: variant.product_id,
        product_variant_id: variant.id,
        product_name: variant.product.name,
        variant_name: variant.name,
        variant_sku: variant.sku,
        inkthreadable_product_id: variant.product.inkthreadable_product_id,
        inkthreadable_variant_id: variant.inkthreadable_variant_id,
        unit_price_amount: variant.price_amount,
        quantity: item.quantity,
        total_amount: variant.price_amount * item.quantity,
        currency: variant.currency,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Clean up order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout/cancelled`,
      customer_email: customer.email,
      metadata: {
        brand_id: brand.id,
        order_id: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
