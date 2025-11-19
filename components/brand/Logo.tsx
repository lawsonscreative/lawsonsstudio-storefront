import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/types/database';

interface LogoProps {
  brand: Brand;
  className?: string;
}

export function Logo({ brand, className = '' }: LogoProps) {
  if (!brand.logo_url) {
    return (
      <Link href="/" className={`text-2xl font-bold font-heading ${className}`}>
        {brand.name}
      </Link>
    );
  }

  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src={brand.logo_url}
        alt={brand.name}
        width={150}
        height={50}
        className="h-12 w-auto"
        priority
      />
    </Link>
  );
}
