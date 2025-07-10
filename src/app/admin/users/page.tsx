"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/db";

const roleOptions = ["All", "user", "admin"];
const statusOptions = ["All", "Active", "Inactive"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin-users");
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to fetch users.");
        // result.users for paginated, result for full
        const users = result.users || result;
        setUsers(users);
      } catch (err: any) {
        setError(err.message);
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: any) => {
    const idStr = user.id ? String(user.id) : "";
    const displayNameStr =
      user.user_metadata?.full_name || user.user_metadata?.display_name || "";
    const emailStr = user.email ? String(user.email) : "";
    const phoneStr = user.phone ? String(user.phone) : "";
    const matchesSearch =
      idStr.toLowerCase().includes(search.toLowerCase()) ||
      displayNameStr.toLowerCase().includes(search.toLowerCase()) ||
      emailStr.toLowerCase().includes(search.toLowerCase()) ||
      phoneStr.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === "All" || user.app_metadata?.provider === role;
    // For status, since Auth users don't have a direct status, treat users with last_sign_in_at as Active, otherwise Inactive
    const userStatus = user.last_sign_in_at ? "Active" : "Inactive";
    const matchesStatus = status === "All" || userStatus === status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await supabase.from("users").delete().eq("id", id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleting(false);
    setDeleteUserId(null);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-black">
        Users Management
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or user ID"
          className="border rounded px-3 py-2 w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UID
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider Type
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sign In At
                </th>
                <th className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-2 sm:px-6 py-4 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.id}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.display_name ||
                        "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.email}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.phone || "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.app_metadata?.provider || "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center">
                      <button
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm font-semibold"
                        onClick={() => setViewUser(user)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs sm:text-sm font-semibold"
                        onClick={() => setDeleteUserId(user.id)}
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
      {viewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="mb-4 space-y-2">
              <div>
                <span className="font-semibold">UID:</span> {viewUser.id}
              </div>
              <div>
                <span className="font-semibold">Display Name:</span>{" "}
                {viewUser.user_metadata?.full_name ||
                  viewUser.user_metadata?.display_name ||
                  "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {viewUser.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {viewUser.phone || "-"}
              </div>
              <div>
                <span className="font-semibold">Provider Type:</span>{" "}
                {viewUser.app_metadata?.provider || "-"}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {viewUser.created_at
                  ? new Date(viewUser.created_at).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-semibold">Last Sign In At:</span>{" "}
                {viewUser.last_sign_in_at
                  ? new Date(viewUser.last_sign_in_at).toLocaleString()
                  : "-"}
              </div>
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={() => setViewUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User (placeholder)</h2>
            <pre className="text-sm text-gray-700 mb-4">
              {JSON.stringify(editUser, null, 2)}
            </pre>
            <button
              className="bg-primary text-white px-4 py-2 rounded mr-2"
              onClick={() => setEditUser(null)}
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
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setDeleteUserId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(deleteUserId!)}
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
