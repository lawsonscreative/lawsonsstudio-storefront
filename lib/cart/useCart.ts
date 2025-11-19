'use client';

/**
 * Cart hook
 * Manages shopping cart state with localStorage persistence
 */

import { useState, useEffect } from 'react';
import type { CartItem } from '@/types/database';

const CART_STORAGE_KEY = 'lawsons-studio-cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_variant_id === item.product_variant_id
      );

      if (existing) {
        return prev.map((i) =>
          i.product_variant_id === item.product_variant_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product_variant_id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (variantId: string) => {
    setItems((prev) =>
      prev.filter((item) => item.product_variant_id !== variantId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.variant.price_amount * item.quantity,
    0
  );

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    isLoaded,
  };
}
