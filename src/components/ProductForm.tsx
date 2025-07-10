"use client";

import { IProduct } from "@/models/Product";
import { useState } from "react";

interface ProductFormProps {
  initialData?: IProduct;
  onSubmit: (product: Omit<IProduct, "id">) => void;
  loading: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  loading,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [image, setImage] = useState(initialData?.image || "");
  const [category, setCategory] = useState(initialData?.category || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, price, image, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-black text-sm font-bold mb-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline text-base sm:text-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-black text-sm font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline text-base sm:text-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-black text-sm font-bold mb-2"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline text-base sm:text-lg"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-black text-sm font-bold mb-2"
        >
          Image URL (e.g., /images/product1.jpg)
        </label>
        <input
          type="text"
          id="image"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline text-base sm:text-lg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-black text-sm font-bold mb-2"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline text-base sm:text-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-lg sm:text-xl transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
