"use client";

import { supabase } from "@/lib/db";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { useEffect, useState } from "react";

async function getProducts(): Promise<IProduct[]> {
  const { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products as IProduct[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);

      const uniqueCategories = Array.from(
        new Set(fetchedProducts.map((p) => p.category))
      );
      setCategories(["All", ...uniqueCategories]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let currentProducts = products;

    // Filter by category
    if (activeCategory !== "All") {
      currentProducts = currentProducts.filter(
        (p) => p.category === activeCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      currentProducts = currentProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(currentProducts);
  }, [activeCategory, searchTerm, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-8 sm:mb-12">
        Our Latest Products
      </h1>

      {/* Search Bar */}
      <div className="mb-6 sm:mb-8 flex flex-col items-center w-full">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black transition-all duration-300 text-base sm:text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="w-full overflow-x-auto flex-nowrap flex gap-2 sm:gap-3 mb-8 sm:mb-12 pb-2 hide-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 rounded-full text-base sm:text-lg font-medium whitespace-nowrap transition-all duration-300
              ${
                activeCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-200 text-black hover:bg-gray-300 hover:text-black"
              }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {filteredProducts.length === 0 && !loading ? (
          <p className="col-span-full text-center text-black text-base sm:text-lg">
            No products found matching your criteria.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative w-full h-48 sm:h-60">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-black mb-1 truncate">
                    {product.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    {product.category}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
