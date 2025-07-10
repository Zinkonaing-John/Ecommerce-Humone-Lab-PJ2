import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-black mb-12">About Stella</h1>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <p className="text-lg leading-relaxed text-gray-700">
          Welcome to Stella, where timeless elegance meets modern simplicity. We believe in curating a collection of products that not only enhance your lifestyle but also tell a story of craftsmanship and thoughtful design.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          Our journey began with a passion for quality and a desire to offer unique items that stand apart. Every product in our selection is hand-picked, ensuring it meets our high standards for durability, aesthetics, and ethical production.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          At Stella, we are more than just an e-commerce store; we are a community of enthusiasts who appreciate beauty in simplicity. We are committed to providing an exceptional shopping experience, from the moment you browse our collection to the joy of receiving your carefully packaged order.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          Thank you for choosing Stella. We hope you find something truly special.
        </p>
      </div>
    </div>
  );
}
