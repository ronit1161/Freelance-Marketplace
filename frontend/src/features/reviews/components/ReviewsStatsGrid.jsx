import React from "react";
import { Star, Award, MessageSquare, ThumbsUp } from "lucide-react";

export default function ReviewsStatsGrid({
  avgRating,
  totalReviews,
  fiveStarCount,
  positivePercentage,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Rating */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">Average Rating</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <Star size={22} className="fill-amber-400 text-amber-400 inline-block" />
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">Overall Client Satisfaction</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Award size={22} />
        </div>
      </div>

      {/* Total Reviews */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">Total Reviews</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{totalReviews}</h2>
          <p className="text-[10px] text-gray-400 mt-1">Feedback Submissions</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center shrink-0">
          <MessageSquare size={22} />
        </div>
      </div>

      {/* 5-Star Reviews */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">5-Star Ratings</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{fiveStarCount}</h2>
          <p className="text-[10px] text-gray-400 mt-1">Perfect Score Ratings</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Star size={22} />
        </div>
      </div>

      {/* Positive Satisfaction Rate */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">Positive Rate</p>
          <h2 className="text-3xl font-extrabold text-indigo-600 mt-1">{positivePercentage}%</h2>
          <p className="text-[10px] text-gray-400 mt-1">4+ Star Ratings</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <ThumbsUp size={22} />
        </div>
      </div>
    </div>
  );
}
