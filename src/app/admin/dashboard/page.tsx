"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/db";

const sampleStats = {
  totalOrders: 128,
  totalUsers: 54,
  totalRevenue: 10234.5,
};

const recentActivity = [
  {
    id: 1,
    type: "Order",
    message: "Order ORD128 placed by Alice Smith.",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "User",
    message: "New user registered: Bob Johnson.",
    time: "10 min ago",
  },
  {
    id: 3,
    type: "Order",
    message: "Order ORD127 marked as shipped.",
    time: "30 min ago",
  },
  {
    id: 4,
    type: "Order",
    message: "Order ORD126 cancelled by user.",
    time: "1 hr ago",
  },
];

export default function AdminDashboardPage() {
  const [orderEvents, setOrderEvents] = useState<any[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("order_events")
        .select("order_id, event_type, event_message, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (!error && data) setOrderEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-black">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-primary mb-2">
            {sampleStats.totalOrders}
          </span>
          <span className="text-lg font-semibold text-gray-700">
            Total Orders
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-primary mb-2">
            {sampleStats.totalUsers}
          </span>
          <span className="text-lg font-semibold text-gray-700">
            Total Users
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-primary mb-2">
            ${sampleStats.totalRevenue.toLocaleString()}
          </span>
          <span className="text-lg font-semibold text-gray-700">
            Total Revenue
          </span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {orderEvents.length === 0 ? (
            <li className="py-3 text-gray-500">No recent order events.</li>
          ) : (
            orderEvents.map((event) => (
              <li
                key={event.created_at + event.order_id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-primary mr-2">
                    [{event.event_type}]
                  </span>
                  <span className="text-black">{event.event_message}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
