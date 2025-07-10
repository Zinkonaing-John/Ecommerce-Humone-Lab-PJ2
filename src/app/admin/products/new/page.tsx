"use client";

import ProductForm from "@/components/ProductForm";
import { supabase } from "@/lib/db";
import { IProduct } from "@/models/Product";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      }
      // In a real app, you'd check for an admin role here
    };
    checkAuth();
  }, [router]);

  const handleAddProduct = async (productData: Omit<IProduct, "id">) => {
    setLoading(true);
    const { error } = await supabase.from("products").insert(productData);
    if (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    } else {
      alert("Product added successfully!");
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
        Add New Product
      </h1>
      <div className="max-w-xs sm:max-w-xl sm:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <ProductForm onSubmit={handleAddProduct} loading={loading} />
      </div>
    </div>
  );
}
