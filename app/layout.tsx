import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { getLawsonsStudioBrand } from "@/lib/brand/resolver";
import { BrandThemeProvider } from "@/components/brand/BrandThemeProvider";
import { CartProvider } from "@/lib/cart/CartContext";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Lawsons Studio",
  description: "Bold, creative, colourful merch with a strong automotive / lifestyle flavour.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brand = await getLawsonsStudioBrand();

  if (!brand) {
    return (
      <html lang="en">
        <body className={`${inter.variable} ${poppins.variable} font-sans`}>
          <div className="flex min-h-screen items-center justify-center">
            <p>Error loading brand configuration</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <CartProvider>
          <BrandThemeProvider brand={brand}>
            <Header brand={brand} />
            {children}
          </BrandThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
