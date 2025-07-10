import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import HeaderContent from "@/components/HeaderContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "A modern e-commerce store built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-secondary-100 min-h-screen"}>
        <CartProvider>
          <header className="bg-dark text-white p-2 sm:p-4 shadow-md">
            <HeaderContent />
          </header>
          <main className="min-h-[70vh] px-2 sm:px-4 md:px-8 py-4 w-full max-w-7xl mx-auto">
            {children}
          </main>
          <footer className="bg-dark text-white p-4 sm:p-8 text-center mt-8">
            <div className="container mx-auto px-2">
              <p className="text-xs sm:text-base">
                &copy; {new Date().getFullYear()} MyStore. All rights reserved.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
