"use client";

import { supabase } from "@/lib/db";
import { IProduct } from "@/models/Product";
import { notFound } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useEffect, useState, use } from "react";
import { User } from "@supabase/supabase-js";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch product
      const { data: fetchedProduct, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError || !fetchedProduct) {
        console.error("Error fetching product:", productError);
        notFound();
        return;
      }
      setProduct(fetchedProduct as IProduct);

      // Fetch reviews
      const { data: fetchedReviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      }
      setReviews(fetchedReviews as Review[]);

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchData();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (newReviewRating === 0) {
      alert("Please select a rating.");
      return;
    }

    setReviewSubmitting(true);
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: parseInt(id as string),
        user_id: user.id,
        rating: newReviewRating,
        comment: newReviewComment,
      })
      .select();

    if (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } else if (data) {
      setReviews([data[0] as Review, ...reviews]);
      setNewReviewRating(0);
      setNewReviewComment("");
      alert("Review submitted successfully!");
    }
    setReviewSubmitting(false);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading product details...
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
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full">
        <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-96 object-contain rounded-lg"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-black mb-3">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{product.category}</p>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 text-xl mr-2">★</span>
              <span className="text-black font-semibold">{averageRating}</span>
              <span className="text-gray-600 text-sm ml-2">
                ({reviews.length} reviews)
              </span>
            </div>
            <p className="text-black leading-relaxed mb-6">
              {product.description}
            </p>
          </div>
          <div className="mt-auto">
            <p className="text-5xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </p>
            <button
              onClick={() => addToCart(product as IProduct)}
              className="w-full bg-primary hover:bg-blue-700 text-black hover:text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-black mb-8">Customer Reviews</h2>

        {user && (
          <div className="mb-10 p-6 border border-gray-200 rounded-lg">
            <h3 className="text-2xl font-semibold text-black mb-4">
              Submit Your Review
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-black text-sm font-bold mb-2">
                  Rating:
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-3xl ${
                        newReviewRating >= star
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                      onClick={() => setNewReviewRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="reviewComment"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Comment:
                </label>
                <textarea
                  id="reviewComment"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-black text-lg">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-black mb-2">{review.comment}</p>
                <p className="text-gray-600 text-sm">
                  By: {review.user_id.substring(0, 8)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
