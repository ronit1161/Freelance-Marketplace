import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { createReview } from "../../../services/reviewApi";
import { useAuth } from "../../../context/AuthContext";
import RatingStars from "./RatingStars";

export default function WriteReviewModal({ order, isOpen, onClose, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user || !user.id) {
      setError("You must be logged in as a Client to submit a review.");
      return;
    }

    if ((order.status || "").toUpperCase() !== "COMPLETED") {
      setError("Reviews can only be submitted for completed orders.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write your feedback comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        clientId: user.id,
        freelancerId: order.freelancerId || order.freelancer?.id || 1,
        orderId: order.id,
        rating,
        comment: comment.trim(),
      });

      setIsSubmitting(false);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-slate-900 font-bold text-lg">Leave a Review</h3>
            <p className="text-xs text-gray-500 mt-0.5">Order #{order.id} • {order.gigTitle || "Service"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Selection */}
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Overall Rating
            </span>
            <div className="flex justify-center">
              <RatingStars
                rating={rating}
                maxRating={5}
                size={28}
                interactive={true}
                onChange={setRating}
              />
            </div>
            <span className="text-xs text-gray-500 font-semibold block">
              {rating} Out of 5 Stars
            </span>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Share your experience working with this freelancer..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-slate-700 rounded-xl font-semibold hover:bg-gray-50 transition text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
