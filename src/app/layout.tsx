import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import HeaderContent from '@/components/HeaderContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Store',
  description: 'A modern e-commerce store built with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <header className="bg-dark text-white p-4 shadow-md">
            <HeaderContent />
          </header>
          <main className="min-h-screen bg-secondary-100">{children}</main>
          <footer className="bg-dark text-white p-8 text-center">
            <div className="container mx-auto">
              <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}