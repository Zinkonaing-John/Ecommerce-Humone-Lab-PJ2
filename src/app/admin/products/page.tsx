"use client";

import { supabase } from "@/lib/db";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchProducts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }
      // In a real app, you'd check for an admin role here

      const { data: fetchedProducts, error } = await supabase
        .from("products")
        .select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(fetchedProducts as IProduct[]);
      }
      setLoading(false);
    };
    checkAuthAndFetchProducts();
  }, [router]);

  const handleDelete = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      if (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      } else {
        setProducts(products.filter((p) => p.id !== productId));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
        Manage Products
      </h1>

      <div className="flex justify-end mb-6 sm:mb-8">
        <Link href="/admin/products/new">
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-xs sm:text-base">
            Add New Product
          </button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-black text-base sm:text-lg">
          No products found.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-black uppercase tracking-wider">
                  Image
                </th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-black uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-black uppercase tracking-wider">
                  Category
                </th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-black uppercase tracking-wider">
                  Price
                </th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-md"
                      width={48}
                      height={48}
                    />
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap font-medium text-black">
                    {product.name}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                    {product.category}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-black">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right font-medium flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="w-full sm:w-auto"
                    >
                      <button
                        className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-base"
                        type="button"
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition-colors duration-200 text-xs sm:text-base"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
