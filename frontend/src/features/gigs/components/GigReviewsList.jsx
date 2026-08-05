import React from "react";
import RatingStars from "../../reviews/components/RatingStars";

export default function GigReviewsList({ reviews, avgRating }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Client Reviews ({reviews.length})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Verified marketplace feedback</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <RatingStars rating={Number(avgRating)} size={14} showLabel={true} />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs font-medium">
          No reviews submitted for this freelancer yet.
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-gray-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">
                  {rev.clientName || `Client #${rev.clientId}`}
                </span>
                <RatingStars rating={rev.rating} size={14} showLabel={true} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                "{rev.comment || "Great service delivered!"}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
