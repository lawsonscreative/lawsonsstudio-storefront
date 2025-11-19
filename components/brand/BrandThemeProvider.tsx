'use client';

/**
 * Brand Theme Provider
 * Dynamically applies brand colors to CSS variables
 */

import { useEffect } from 'react';
import type { Brand } from '@/types/database';

interface BrandThemeProviderProps {
  brand: Brand;
  children: React.ReactNode;
}

export function BrandThemeProvider({ brand, children }: BrandThemeProviderProps) {
  useEffect(() => {
    // Apply brand colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brand.primary_color);
    root.style.setProperty('--brand-secondary', brand.secondary_color);
    root.style.setProperty('--brand-accent', brand.accent_color);
    root.style.setProperty('--brand-dark', brand.background_color_dark);
  }, [brand]);

  return <>{children}</>;
}
