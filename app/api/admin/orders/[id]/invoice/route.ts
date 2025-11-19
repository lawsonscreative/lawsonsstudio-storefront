import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getLawsonsStudioBrand } from '@/lib/brand/resolver';
import { formatPrice } from '@/lib/utils/format';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await getLawsonsStudioBrand();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const supabase = await createClient();

    const { data: order } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          variant_name,
          quantity,
          price_at_purchase,
          currency
        )
      `)
      .eq('id', params.id)
      .eq('brand_id', brand.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate simple HTML invoice
    const subtotal = order.order_items?.reduce(
      (sum: number, item: any) => sum + item.price_at_purchase * item.quantity,
      0
    ) || 0;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${order.order_number || order.id.slice(0, 8).toUpperCase()}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      border-bottom: 3px solid #28E8EB;
      padding-bottom: 20px;
    }
    .company {
      font-size: 24px;
      font-weight: bold;
      color: #160F19;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      color: #28E8EB;
    }
    .invoice-details {
      text-align: right;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 20px;
      text-align: right;
    }
    .totals-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .totals-label {
      width: 150px;
      text-align: right;
      padding-right: 20px;
    }
    .totals-value {
      width: 120px;
      text-align: right;
    }
    .total-final {
      font-size: 18px;
      font-weight: bold;
      padding-top: 10px;
      border-top: 2px solid #333;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .addresses {
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }
    .address-block {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">Lawsons Studio</div>
      <div style="font-size: 12px; color: #666; margin-top: 5px;">
        A trading name of Lawsons Enterprises Ltd<br>
        Registered in England & Wales<br>
        Kent, United Kingdom
      </div>
    </div>
    <div class="invoice-details">
      <div class="invoice-title">INVOICE</div>
      <div style="font-size: 14px; margin-top: 10px;">
        <strong>#${order.order_number || order.id.slice(0, 8).toUpperCase()}</strong><br>
        ${new Date(order.created_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <div class="section-title">Bill To</div>
      <div>
        <strong>${order.customer_name || `${order.customer_first_name} ${order.customer_last_name}`}</strong><br>
        ${order.customer_email}<br>
        ${order.customer_phone || ''}
        ${order.billing_address_line1 ? `<br><br>${order.billing_address_line1}` : ''}
        ${order.billing_address_line2 ? `<br>${order.billing_address_line2}` : ''}
        ${order.billing_city ? `<br>${order.billing_city}, ${order.billing_postal_code}` : ''}
        ${order.billing_county ? `<br>${order.billing_county}` : ''}
        ${order.billing_country ? `<br>${order.billing_country}` : ''}
      </div>
    </div>

    ${order.shipping_address_line1 ? `
    <div class="address-block">
      <div class="section-title">Ship To</div>
      <div>
        <strong>${order.customer_name || `${order.customer_first_name} ${order.customer_last_name}`}</strong><br>
        ${order.shipping_address_line1}<br>
        ${order.shipping_address_line2 ? `${order.shipping_address_line2}<br>` : ''}
        ${order.shipping_city}, ${order.shipping_postal_code}<br>
        ${order.shipping_county ? `${order.shipping_county}<br>` : ''}
        ${order.shipping_country}
      </div>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <div class="section-title">Order Items</div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.order_items?.map((item: any) => `
          <tr>
            <td>
              <strong>${item.product_name}</strong><br>
              <span style="color: #666; font-size: 14px;">${item.variant_name}</span>
            </td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${formatPrice(item.price_at_purchase, item.currency)}</td>
            <td class="text-right">${formatPrice(item.price_at_purchase * item.quantity, item.currency)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="totals">
    <div class="totals-row">
      <div class="totals-label">Subtotal:</div>
      <div class="totals-value">${formatPrice(subtotal, order.currency)}</div>
    </div>
    <div class="totals-row">
      <div class="totals-label">Shipping:</div>
      <div class="totals-value">${formatPrice(order.shipping_amount || 0, order.currency)}</div>
    </div>
    <div class="totals-row">
      <div class="totals-label">Tax:</div>
      <div class="totals-value">${formatPrice(order.tax_amount || 0, order.currency)}</div>
    </div>
    <div class="totals-row total-final">
      <div class="totals-label">Total:</div>
      <div class="totals-value">${formatPrice(order.total_amount, order.currency)}</div>
    </div>
  </div>

  ${order.stripe_payment_intent_id ? `
  <div class="section">
    <div class="section-title">Payment Information</div>
    <div>
      <strong>Payment Method:</strong> Stripe<br>
      <strong>Payment Status:</strong> ${order.status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}<br>
      <strong>Transaction ID:</strong> <span style="font-family: monospace; font-size: 12px;">${order.stripe_payment_intent_id}</span>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for your order!</p>
    <p style="margin-top: 10px;">
      For questions about this invoice, contact us at <strong>info@lawsonsstudio.co.uk</strong>
    </p>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${order.order_number || order.id.slice(0, 8)}.html"`,
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
