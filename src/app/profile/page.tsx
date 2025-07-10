"use client";

import { supabase } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  status?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const getUserAndOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setUser(user);

        const { data: fetchedOrders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
        } else {
          setOrders(fetchedOrders as Order[]);
        }
        setLoading(false);
      }
    };
    getUserAndOrders();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/login");
        } else {
          setUser(session.user);
          // Re-fetch orders if auth state changes (e.g., user logs in)
          getUserAndOrders();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleCancelOrder = async (orderId: number) => {
    setCancellingOrderId(orderId);
    try {
      const res = await fetch("/api/cancel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      // Refresh orders
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("User not found");
      const { data: fetchedOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });
      setOrders(fetchedOrders as Order[]);
    } catch {
      alert("Failed to cancel order. Please try again.");
    }
    setCancellingOrderId(null);
    setShowConfirm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
        User Profile
      </h1>

      <div className="max-w-xl sm:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
          Account Information
        </h2>
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-black">
            <span className="font-semibold">Name:</span>{" "}
            {user?.user_metadata?.name || (
              <span className="italic text-gray-500">(No name set)</span>
            )}
          </p>
          <p className="text-base sm:text-lg text-black">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
          Order History
        </h2>
        {orders.length === 0 ? (
          <p className="text-black">No orders found. Start shopping now!</p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-black">
                    Order #{order.id}
                  </h3>
                  <span className="text-gray-600 text-xs sm:text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status
                      ? order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      : "Pending"}
                  </span>
                  {order.status !== "cancelled" && (
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs font-semibold disabled:opacity-50"
                      disabled={cancellingOrderId === order.id}
                      onClick={() =>
                        setShowConfirm({
                          id: order.id,
                          name: order.items[0]?.name || "",
                        })
                      }
                    >
                      {cancellingOrderId === order.id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
                <ul className="list-disc list-inside text-black mb-2 sm:mb-4 text-sm sm:text-base">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="text-lg sm:text-xl font-bold text-primary text-right">
                  Total: ${order.total_amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Confirm Cancel
            </h2>
            <p className="mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setShowConfirm(null)}
                disabled={cancellingOrderId === showConfirm.id}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleCancelOrder(showConfirm.id)}
                disabled={cancellingOrderId === showConfirm.id}
              >
                {cancellingOrderId === showConfirm.id
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
