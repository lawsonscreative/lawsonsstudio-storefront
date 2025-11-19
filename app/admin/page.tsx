import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to products page
  redirect('/admin/products');
}
