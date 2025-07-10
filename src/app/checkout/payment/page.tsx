"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/db";
import { User } from "@supabase/supabase-js";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    // Redirect to cart if no items in cart and not already processing payment
    if (cart.length === 0 && paymentSuccess === null && !loading) {
      router.push("/cart");
    }
  }, [cart, router, paymentSuccess, loading]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentSuccess(null);

    if (!user) {
      alert("You must be logged in to place an order.");
      router.push("/login");
      setLoading(false);
      return;
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const success = Math.random() > 0.1; // 90% chance of success

    if (success) {
      const orderItems = cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        total_amount: totalAmount,
        items: orderItems,
      });

      if (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
        setPaymentSuccess(false);
      } else {
        setPaymentSuccess(true);
        clearCart(); // Clear cart after successful order
        router.push("/order-confirmation");
      }
    } else {
      setPaymentSuccess(false);
      alert("Payment failed. Please try again.");
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-black mb-8">
          Payment Details
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-3">
            Order Summary
          </h2>
          <div className="flex justify-between text-lg text-black mb-2">
            <span>Items:</span>
            <span>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold text-black border-t border-gray-300 pt-4">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-black text-sm font-bold mb-2"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              placeholder="XXXX XXXX XXXX XXXX"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="expiryDate"
                className="block text-black text-sm font-bold mb-2"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="cvv"
                className="block text-black text-sm font-bold mb-2"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                placeholder="XXX"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing Payment..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
