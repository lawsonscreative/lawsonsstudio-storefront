/**
 * Formatting utilities
 */

/**
 * Format price from smallest currency unit (pence) to display format (£X.XX)
 */
export function formatPrice(amountInPence: number, currency: string = 'GBP'): string {
  const amount = amountInPence / 100;

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date to readable format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format order status to readable text
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending_payment: 'Pending Payment',
    paid: 'Paid',
    in_production: 'In Production',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };

  return statusMap[status] || status;
}
