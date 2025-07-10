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
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-black mb-12">
        User Profile
      </h1>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          Account Information
        </h2>
        <div className="space-y-4 mb-8">
          <p className="text-lg text-black">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p className="text-lg text-black">
            <span className="font-semibold">User ID:</span> {user?.id}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-black">No orders found. Start shopping now!</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-black">
                    Order #{order.id}
                  </h3>
                  <span className="text-gray-600 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <ul className="list-disc list-inside text-black mb-4">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-bold text-primary text-right">
                  Total: ${order.total_amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
