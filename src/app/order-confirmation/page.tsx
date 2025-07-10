"use client";

import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 sm:mb-6">
        Order Confirmed!
      </h1>
      <p className="text-base sm:text-xl text-gray-700 mb-6 sm:mb-8">
        Thank you for your purchase. Your order has been successfully placed and
        is being processed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs sm:max-w-none mx-auto">
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
