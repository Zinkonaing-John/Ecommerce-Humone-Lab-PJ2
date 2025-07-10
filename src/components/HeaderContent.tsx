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
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Responsive nav links
  let navLinks;
  if (user?.app_metadata?.is_admin) {
    navLinks = (
      <>
        <li>
          <Link
            href="/admin/dashboard"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            href="/admin/users"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            href="/admin/products"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
        </li>
        <li>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-inner mr-2">
            {user.email ? user.email[0].toUpperCase() : "A"}
          </div>
        </li>
        <li>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-md hover:scale-105 w-full md:w-auto mt-2 md:mt-0"
          >
            Logout
          </button>
        </li>
      </>
    );
  } else {
    navLinks = (
      <>
        <li>
          <Link
            href="/products"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </li>
        <li className="relative">
          <Link
            href="/cart"
            className="relative text-black hover:font-bold transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-inner mr-2">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </div>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-md hover:scale-105 w-full md:w-auto mt-2 md:mt-0"
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
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="relative text-black hover:font-bold transition-colors duration-200 after:block after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </>
    );
  }

  return (
    <nav className="sticky top-4 z-50 w-full max-w-7xl mx-auto bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl px-4 sm:px-8 py-4 mt-4 mb-6 border border-white/40">
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm"
        >
          MyStore
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`block w-7 h-0.5 bg-black mb-1.5 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-0.5 bg-black mb-1.5 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-0.5 bg-black transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
        {/* Desktop nav */}
        <ul className="hidden md:flex space-x-6 items-center">{navLinks}</ul>
      </div>
      {/* Mobile nav */}
      {menuOpen && (
        <ul className="flex flex-col space-y-2 mt-4 md:hidden bg-white/95 rounded-xl p-4 shadow-lg animate-fade-in">
          {navLinks}
        </ul>
      )}
    </nav>
  );
}
