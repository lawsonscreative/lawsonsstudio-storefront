'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import Link from 'next/link';

interface ProductActionsProps {
  productId: string;
  productSlug: string;
  productName: string;
}

export function ProductActions({ productId, productSlug, productName }: ProductActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const supabase = createClient();

      // Delete product (variants will be cascade deleted)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/products/${productSlug}`}
        className="text-brand-primary hover:text-brand-primary/90"
      >
        View
      </Link>
      <Link
        href={`/admin/products/edit/${productId}`}
        className="text-gray-600 hover:text-gray-900"
      >
        Edit
      </Link>
      {showConfirm ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Confirm'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={deleting}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}
