'use client';

import Link from 'next/link';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-extrabold text-primary mb-6">Order Confirmed!</h1>
      <p className="text-xl text-gray-700 mb-8">Thank you for your purchase. Your order has been successfully placed and is being processed.</p>
      <div className="space-x-4">
        <Link href="/products">
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            Continue Shopping
          </button>
        </Link>
        <Link href="/profile">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            View Orders
          </button>
        </Link>
      </div>
    </div>
  );
}
