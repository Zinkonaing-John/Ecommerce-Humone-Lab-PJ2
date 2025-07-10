"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessageSent(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real application, you would send formData to your backend
    console.log("Form submitted:", formData);

    setSubmitting(false);
    setMessageSent(true);
    setFormData({ name: "", email: "", message: "" }); // Clear form
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-black mb-12">
        Contact Us
      </h1>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <p className="text-lg leading-relaxed text-gray-700 mb-8 text-center">
          Have a question or need assistance? Fill out the form below or reach
          out to us directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
              {messageSent && (
                <p className="text-primary text-center mt-4">
                  Thank you for your message! We&apos;ll get back to you soon.
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">
              Contact Information
            </h2>
            <div className="space-y-4 text-black text-lg">
              <p>
                <span className="font-semibold">Email:</span> support@stella.com
              </p>
              <p>
                <span className="font-semibold">Phone:</span> +1 (555) 123-4567
              </p>
              <p>
                <span className="font-semibold">Address:</span> 123 Design
                Street, Suite 456, Creative City, CA 90210
              </p>
              <p className="pt-4">
                Our customer service team is available Monday to Friday, 9 AM -
                5 PM EST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
