/**
 * Inkthreadable API client
 * Handles POD order placement with signature-based authentication
 */

import crypto from 'crypto';

const APP_ID = process.env.INKTHREADABLE_APP_ID!;
const SECRET_KEY = process.env.INKTHREADABLE_SECRET_KEY!;
const MODE = process.env.INKTHREADABLE_MODE || 'live'; // 'dry-run' or 'live'
const BASE_URL = 'https://www.inkthreadable.co.uk/api';

interface InkthreadableOrderItem {
  product_id: string;
  variant_id: string;
  quantity: number;
}

interface InkthreadableOrder {
  recipient_name: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  phone?: string;
  items: InkthreadableOrderItem[];
  reference?: string;
}

interface InkthreadableResponse {
  success: boolean;
  order_id?: string;
  message?: string;
  errors?: any;
}

/**
 * Generate SHA1 signature for Inkthreadable API request
 */
function generateSignature(body: string): string {
  const hash = crypto
    .createHash('sha1')
    .update(body + SECRET_KEY)
    .digest('hex');
  return hash;
}

/**
 * Create order in Inkthreadable
 */
export async function createInkthreadableOrder(
  order: InkthreadableOrder
): Promise<InkthreadableResponse> {
  // Dry-run mode: simulate successful order creation
  if (MODE === 'dry-run') {
    console.log('[Inkthreadable Dry-Run] Would create order:', order);
    return {
      success: true,
      order_id: `DRY_${Date.now()}`,
      message: 'Dry-run mode: Order not actually placed',
    };
  }

  try {
    // Build request body
    const requestBody = JSON.stringify({
      app_id: APP_ID,
      recipient: {
        name: order.recipient_name,
        address_line1: order.line1,
        address_line2: order.line2 || '',
        city: order.city,
        county: order.county || '',
        postcode: order.postcode,
        country: order.country,
        phone: order.phone || '',
      },
      items: order.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      reference: order.reference,
    });

    // Generate signature
    const signature = generateSignature(requestBody);

    // Make API request
    const response = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
      body: requestBody,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Inkthreadable API error:', data);
      return {
        success: false,
        message: data.message || 'Failed to create order',
        errors: data.errors,
      };
    }

    return {
      success: true,
      order_id: data.order_id,
      message: 'Order created successfully',
    };
  } catch (error) {
    console.error('Inkthreadable client error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get order status from Inkthreadable (for future use)
 */
export async function getOrderStatus(orderId: string): Promise<any> {
  if (MODE === 'dry-run') {
    return {
      success: true,
      status: 'in_production',
      message: 'Dry-run mode',
    };
  }

  try {
    const requestBody = JSON.stringify({
      app_id: APP_ID,
      order_id: orderId,
    });

    const signature = generateSignature(requestBody);

    const response = await fetch(`${BASE_URL}/orders/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
      body: requestBody,
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to get order status:', error);
    return { success: false, message: 'Failed to get order status' };
  }
}
