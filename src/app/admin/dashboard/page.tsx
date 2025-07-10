"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { addMonths, format, isAfter, isBefore, parseISO } from "date-fns";

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
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [ordersByMonth, setOrdersByMonth] = useState<
    { month: string; count: number }[]
  >([]);
  const [revenueByMonth, setRevenueByMonth] = useState<
    { month: string; revenue: number }[]
  >([]);
  const [topProducts, setTopProducts] = useState<
    { name: string; quantity: number; category: string }[]
  >([]);
  const [orderStatusData, setOrderStatusData] = useState<
    { status: string; count: number }[]
  >([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(addMonths(new Date(), -5), "yyyy-MM-01"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e42",
    "#ef4444",
    "#a855f7",
    "#fbbf24",
  ];
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    "All",
  ]);

  useEffect(() => {
    const fetchStatsAndEvents = async () => {
      // Date range filter
      const start = dateRange.start;
      const end = dateRange.end;
      // Fetch orders in range
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, created_at, total_amount, status, items")
        .gte("created_at", start)
        .lte("created_at", end);
      // Orders per month
      if (ordersData) {
        const monthCounts: Record<string, number> = {};
        const monthRevenue: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};
        const productMap: Record<
          string,
          { name: string; quantity: number; category: string }
        > = {};
        ordersData.forEach((order) => {
          const month = new Date(order.created_at).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          monthCounts[month] = (monthCounts[month] || 0) + 1;
          if (order.status !== "cancelled") {
            monthRevenue[month] =
              (monthRevenue[month] || 0) + (order.total_amount || 0);
          }
          statusCounts[order.status || "pending"] =
            (statusCounts[order.status || "pending"] || 0) + 1;
          // Top products
          if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
              if (
                !categoryFilter ||
                categoryFilter === "All" ||
                item.category === categoryFilter
              ) {
                if (!productMap[item.name]) {
                  productMap[item.name] = {
                    name: item.name,
                    quantity: 0,
                    category: item.category,
                  };
                }
                productMap[item.name].quantity += item.quantity;
              }
            });
          }
        });
        setOrdersByMonth(
          Object.entries(monthCounts).map(([month, count]) => ({
            month,
            count,
          }))
        );
        setRevenueByMonth(
          Object.entries(monthRevenue).map(([month, revenue]) => ({
            month,
            revenue,
          }))
        );
        setOrderStatusData(
          Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
          }))
        );
        // Top products (sorted by quantity)
        const topProductsArr = Object.values(productMap)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 8);
        setTopProducts(topProductsArr);
      }
      // Fetch all categories for filter
      const { data: productsData } = await supabase
        .from("products")
        .select("category");
      if (productsData) {
        const categories = Array.from(
          new Set(productsData.map((p) => p.category))
        ).filter(Boolean);
        setAvailableCategories(["All", ...categories]);
      }
      // Fetch order stats
      const { count: orderCount } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true });
      // Fetch user count from Auth
      let userCount = 0;
      try {
        const res = await fetch("/api/admin-users");
        const result = await res.json();
        const users = result.users || result;
        userCount = Array.isArray(users) ? users.length : 0;
      } catch {
        userCount = 0;
      }
      // Fetch revenue
      const { data: revenueRows } = await supabase
        .from("orders")
        .select("total_amount")
        .not("status", "eq", "cancelled");
      const totalRevenue = revenueRows
        ? revenueRows.reduce((sum, row) => sum + (row.total_amount || 0), 0)
        : 0;
      setStats({
        totalOrders: orderCount || 0,
        totalUsers: userCount,
        totalRevenue,
      });
      // Fetch recent order events
      const { data: events } = await supabase
        .from("order_events")
        .select("order_id, event_type, event_message, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (events) setOrderEvents(events);
    };
    fetchStatsAndEvents();
  }, [dateRange, categoryFilter]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
          <span className="text-lg sm:text-xl font-semibold text-black">
            Orders
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {stats.totalOrders}
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
          <span className="text-lg sm:text-xl font-semibold text-black">
            Users
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {stats.totalUsers}
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
          <span className="text-lg sm:text-xl font-semibold text-black">
            Revenue
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            ${stats.totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filters */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <label className="text-sm font-semibold text-black">Category:</label>
          <select
            className="border rounded px-3 py-2 w-full sm:w-auto"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <label className="text-sm font-semibold text-black">
            Date Range:
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full sm:w-auto"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            className="border rounded px-3 py-2 w-full sm:w-auto"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Orders by Month Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 text-black">
            Orders per Month
          </h2>
          <div className="w-full min-w-[320px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Revenue by Month Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 text-black">
            Revenue per Month
          </h2>
          <div className="w-full min-w-[320px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Top Products Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 text-black">Top Products</h2>
          <div className="w-full min-w-[320px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="quantity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#6366f1"
                  label
                >
                  {topProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 text-black">Order Status</h2>
          <div className="w-full min-w-[320px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#f59e42"
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-status-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-2 text-black">Recent Activity</h2>
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
