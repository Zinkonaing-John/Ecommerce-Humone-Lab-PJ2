"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-black text-base sm:text-lg">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/products">
            <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-3 sm:p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="w-24 h-24 flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                    width={96}
                    height={96}
                  />
                </div>
                <div className="flex-grow w-full">
                  <h2 className="text-lg sm:text-xl font-semibold text-black">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex flex-wrap items-center mt-2 gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-black px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="mx-2 text-base sm:text-lg font-medium text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 text-black px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition-colors font-semibold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-lg sm:text-xl font-bold text-primary mt-2 sm:mt-0 sm:ml-4">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-3 sm:p-6 h-fit mt-6 lg:mt-0">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
              Order Summary
            </h2>
            <div className="flex justify-between text-base sm:text-lg text-black mb-2 sm:mb-3">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg text-black mb-4 sm:mb-6">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-lg sm:text-2xl font-bold text-black border-t border-gray-300 pt-3 sm:pt-4">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-lg sm:text-xl transition-colors duration-300 mt-6 shadow-lg hover:shadow-xl">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
