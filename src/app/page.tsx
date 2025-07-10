"use client";

import { supabase } from "@/lib/db";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";

async function getFeaturedProducts(): Promise<IProduct[]> {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(4);
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products as IProduct[];
}

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const fetchedProducts = await getFeaturedProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/hero-bg-opulent.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg text-gold">
            Opulent
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl text-red-500">
            Your one-stop shop for premium, high-quality products.
          </p>
          <Link href="/products">
            <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105 hover-glow">
              Explore Products
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <Link href={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src="/images/about-opulent.jpg"
              alt="About Opulent"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-6">About Opulent</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Opulent is a curated marketplace for luxury goods, offering a
              unique selection of high-quality items from around the world. Our
              mission is to provide a seamless and enjoyable shopping
              experience, with a focus on quality, craftsmanship, and customer
              satisfaction.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
