"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-black mb-12">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-black text-lg">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/products">
            <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="w-24 h-24 flex-shrink-0 mr-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-black">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-black px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="mx-3 text-lg font-medium text-black">
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
                      className="ml-auto text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary ml-4">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-black mb-6">
              Order Summary
            </h2>
            <div className="flex justify-between text-lg text-black mb-3">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-black mb-6">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-black border-t border-gray-300 pt-4">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors duration-300 mt-8 shadow-lg hover:shadow-xl">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
