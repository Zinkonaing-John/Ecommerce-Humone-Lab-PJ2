"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/db";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "order_received", label: "Order Received" },
  { value: "order_shipped", label: "Order Shipped" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewOrder, setViewOrder] = useState<any | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // 1. Add local state to track edited status for each order
  const [editedStatuses, setEditedStatuses] = useState<Record<string, string>>(
    {}
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      let query = supabase
        .from("orders")
        .select("id, user_id, total_amount, items, created_at, status");
      const { data, error } = await query;
      if (error) {
        setError("Failed to fetch orders.");
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const idStr = order.id ? String(order.id) : "";
    const userIdStr = order.user_id ? String(order.user_id) : "";
    const matchesSearch =
      idStr.toLowerCase().includes(search.toLowerCase()) ||
      userIdStr.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || order.status === status;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await supabase.from("orders").delete().eq("id", id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setDeleting(false);
    setDeleteOrderId(null);
  };

  // 2. Update handleStatusChange to only update local state
  const handleStatusChange = (orderId: number, newStatus: string) => {
    setEditedStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // 3. Add a function to update the status in the database
  const handleUpdateStatus = async (orderId: number) => {
    setUpdatingOrderId(orderId.toString());
    const newStatus = editedStatuses[orderId];
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) {
      alert("Failed to update status.");
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      // Optionally, trigger a refresh in the user's profile (if using a shared context or event log)
    }
    setUpdatingOrderId(null);
    setEditedStatuses((prev) => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-black">
        Orders Management
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by order ID or customer name"
          className="border rounded px-3 py-2 w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 w-full sm:w-1/4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-2 sm:px-6 py-4 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {order.id}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {order.user_id}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      ${order.total_amount?.toFixed(2) ?? "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {Array.isArray(order.items) ? order.items.length : 0}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                      >
                        {order.status
                          ? order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center">
                      <button
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm font-semibold"
                        onClick={() => setViewOrder(order)}
                      >
                        View
                      </button>
                      <select
                        className="border rounded px-2 py-1 text-xs sm:text-sm font-semibold bg-white"
                        value={
                          editedStatuses[order.id] ??
                          (order.status || "pending")
                        }
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          !editedStatuses[order.id] ||
                          editedStatuses[order.id] === order.status ||
                          updatingOrderId === order.id.toString()
                        }
                        onClick={() => handleUpdateStatus(order.id)}
                        type="button"
                      >
                        {updatingOrderId === order.id.toString()
                          ? "Updating..."
                          : "Update"}
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs sm:text-sm font-semibold"
                        onClick={() => setDeleteOrderId(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs sm:max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="mb-4 space-y-2">
              <div>
                <span className="font-semibold">Order ID:</span> {viewOrder.id}
              </div>
              <div>
                <span className="font-semibold">User ID:</span>{" "}
                {viewOrder.user_id}
              </div>
              <div>
                <span className="font-semibold">Total Amount:</span> $
                {viewOrder.total_amount?.toFixed(2) ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {viewOrder.created_at
                  ? new Date(viewOrder.created_at).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${viewOrder.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                >
                  {viewOrder.status
                    ? viewOrder.status.charAt(0).toUpperCase() +
                      viewOrder.status.slice(1)
                    : "Pending"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Items:</span>
                {Array.isArray(viewOrder.items) &&
                viewOrder.items.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {viewOrder.items.map((item: any, idx: number) => (
                      <li key={idx} className="border rounded p-2 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded-md mb-2 sm:mb-0"
                            />
                          )}
                          <div>
                            <span className="block text-sm font-semibold text-black">
                              {item.name}
                            </span>
                            <span className="block text-xs text-gray-600">
                              Category: {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
                          <span className="block text-xs text-gray-700">
                            Quantity: {item.quantity}
                          </span>
                          <span className="block text-xs text-gray-700">
                            Price: ${item.price?.toFixed(2) ?? "-"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2 text-gray-500">No items</span>
                )}
              </div>
            </div>
            <button
              className="w-full bg-primary text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition-colors"
              onClick={() => setViewOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Order (placeholder)</h2>
            <pre className="text-sm text-gray-700 mb-4">
              {JSON.stringify(editOrder, null, 2)}
            </pre>
            <button
              className="bg-primary text-white px-4 py-2 rounded mr-2"
              onClick={() => setEditOrder(null)}
            >
              Cancel
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              disabled
            >
              Save (Coming Soon)
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation */}
      {deleteOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">Are you sure you want to delete this order?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setDeleteOrderId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(deleteOrderId!)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
