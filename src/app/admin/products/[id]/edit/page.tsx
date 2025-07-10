"use client";

import ProductForm from "@/components/ProductForm";
import { supabase } from "@/lib/db";
import { IProduct } from "@/models/Product";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchProduct = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }
      // In a real app, you'd check for an admin role here

      const { data: fetchedProduct, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !fetchedProduct) {
        console.error("Error fetching product:", error);
        notFound();
      } else {
        setProduct(fetchedProduct as IProduct);
      }
      setLoading(false);
    };
    checkAuthAndFetchProduct();
  }, [id, router]);

  const handleEditProduct = async (productData: Omit<IProduct, "id">) => {
    setLoading(true);
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id);
    if (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } else {
      alert("Product updated successfully!");
      router.push("/admin/products");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-black mb-12">
        Edit Product
      </h1>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <ProductForm
          initialData={product}
          onSubmit={handleEditProduct}
          loading={loading}
        />
      </div>
    </div>
  );
}
