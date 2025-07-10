"use client";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/db";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart"); // Redirect to cart if empty
    }
  }, [cart, router]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real application, you might validate shipping info here
    router.push("/checkout/payment");
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-black mb-12">
        Checkout
      </h1>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-black">
                {item.name} (x{item.quantity})
              </span>
              <span className="font-semibold text-black">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xl font-bold text-black border-t border-gray-300 pt-4 mb-8">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">
          Shipping Information
        </h2>
        <form onSubmit={handleProceedToPayment} className="space-y-4 mb-8">
          <div>
            <label
              htmlFor="fullName"
              className="block text-black text-sm font-bold mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-black text-sm font-bold mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              placeholder="123 Main St"
              required
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-black text-sm font-bold mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Anytown"
              required
            />
          </div>
          <div>
            <label
              htmlFor="zip"
              className="block text-black text-sm font-bold mb-2"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zip"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              placeholder="12345"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Proceeding..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}
