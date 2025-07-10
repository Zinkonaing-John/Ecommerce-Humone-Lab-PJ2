"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/db";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function HeaderContent() {
  const { cart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="sticky top-4 z-50 container mx-auto flex justify-between items-center bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl px-8 py-4 mt-4 mb-6 border border-white/40">
      <Link
        href="/"
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm"
      >
        MyStore
      </Link>
      <ul className="flex space-x-6 items-center">
        <li>
          <Link
            href="/products"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
          >
            Contact
          </Link>
        </li>
        <li>
          <Link
            href="/cart"
            className="relative text-black hover:font-bold transition-colors duration-200"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-ping-short shadow-lg">
                {cart.length}
              </span>
            )}
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link
                href="/profile"
                className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Profile
              </Link>
            </li>
            {user?.app_metadata?.is_admin && (
              <li>
                <Link
                  href="/admin/products"
                  className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                >
                  Admin
                </Link>
              </li>
            )}
            <li>
              {/* Placeholder for user avatar/icon */}
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-inner mr-2">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </div>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-md hover:scale-105"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/login"
                className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
