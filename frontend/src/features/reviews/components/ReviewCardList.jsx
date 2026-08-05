import React from "react";
import { Star, Briefcase, Calendar } from "lucide-react";

export default function ReviewCardList({ filteredReviews, ordersMap }) {
  if (!filteredReviews || filteredReviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs font-medium">
        No client reviews found matching criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredReviews.map((rev) => {
        const gigTitle = ordersMap[rev.orderId] || `Service Order #${rev.orderId}`;
        const ratingNum = rev.rating || 5;

        return (
          <div
            key={rev.id}
            className="p-6 bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl transition space-y-4 shadow-sm"
          >
            {/* Header: Client & Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0058be] font-extrabold text-sm flex items-center justify-center shrink-0 border border-blue-200">
                  {(rev.clientName || "C")[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {rev.clientName || `Client #${rev.clientId}`}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <Briefcase size={12} className="text-[#0058be]" />
                    <span>{gigTitle}</span>
                  </div>
                </div>
              </div>

              {/* Star Rating Display */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shrink-0">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= ratingNum
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="font-bold text-xs text-slate-900 ml-1">
                  {ratingNum}.0
                </span>
              </div>
            </div>

            {/* Feedback Comment */}
            <div className="space-y-1">
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-200">
                "{rev.comment || "Great experience working together!"}"
              </p>
            </div>

            {/* Footer Date & Order Reference */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pt-1">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Submitted on {rev.createdOn || "N/A"}</span>
              </div>
              <span className="font-mono text-gray-400">Order ID: #{rev.orderId}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
