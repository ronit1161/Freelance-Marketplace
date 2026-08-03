import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getReviewsForFreelancer } from "../../../services/reviewApi";
import { getFreelancerOrders } from "../../../services/orderApi";
import {
  Star,
  Search,
  Filter,
  MessageSquare,
  User,
  Briefcase,
  Calendar,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Award,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";

export default function FreelancerReviewsPage() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [ordersMap, setOrdersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchClientName, setSearchClientName] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  useEffect(() => {
    if (user?.id) {
      loadFreelancerReviewsData();
    }
  }, [user]);

  const loadFreelancerReviewsData = async () => {
    setLoading(true);
    setError("");
    try {
      const [reviewsData, ordersData] = await Promise.all([
        getReviewsForFreelancer(user.id).catch(() => []),
        getFreelancerOrders(user.id).catch(() => []),
      ]);

      setReviews(reviewsData || []);

      // Build a map of orderId -> gigTitle
      const map = {};
      (ordersData || []).forEach((ord) => {
        map[ord.id] = ord.gigTitle || `Gig #${ord.gigId}`;
      });
      setOrdersMap(map);
    } catch (err) {
      console.error("Failed to load freelancer reviews:", err);
      setError(err?.message || "Failed to load client reviews.");
    } finally {
      setLoading(false);
    }
  };

  // Metrics Calculations
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : "5.0";

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const positivePercentage =
    totalReviews > 0
      ? Math.round((reviews.filter((r) => (r.rating || 5) >= 4).length / totalReviews) * 100)
      : 100;

  // Filtered Reviews
  const filteredReviews = reviews.filter((rev) => {
    const matchesClient = (rev.clientName || `Client #${rev.clientId}`)
      .toLowerCase()
      .includes(searchClientName.toLowerCase().trim());

    const matchesRating =
      ratingFilter === "ALL" || String(rev.rating) === String(ratingFilter);

    return matchesClient && matchesRating;
  });

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <MessageSquare size={16} />
            <span>Client Feedback & Testimonials</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Client Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review feedback, ratings, and testimonials submitted by marketplace clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/freelancer"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back to Console</span>
          </Link>
          <button
            onClick={loadFreelancerReviewsData}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            <span>Refresh Reviews</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS FOR RATING INFORMATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Rating */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Average Rating</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <span>{avgRating}</span>
              <Star size={22} className="fill-amber-400 text-amber-400 inline-block" />
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Overall Client Satisfaction</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Total Reviews</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{totalReviews}</h2>
            <p className="text-[10px] text-gray-400 mt-1">Feedback Submissions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0058be] flex items-center justify-center shrink-0">
            <MessageSquare size={22} />
          </div>
        </div>

        {/* 5-Star Reviews */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">5-Star Ratings</p>
            <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{fiveStarCount}</h2>
            <p className="text-[10px] text-gray-400 mt-1">Perfect Score Ratings</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Star size={22} />
          </div>
        </div>

        {/* Positive Satisfaction Rate */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Positive Rate</p>
            <h2 className="text-3xl font-extrabold text-indigo-600 mt-1">{positivePercentage}%</h2>
            <p className="text-[10px] text-gray-400 mt-1">4+ Star Ratings</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ThumbsUp size={22} />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        {/* Search & Rating Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search by Client Name */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by client name..."
              value={searchClientName}
              onChange={(e) => setSearchClientName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Rating Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400 shrink-0" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="py-2.5 px-4 border border-gray-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="1">1 Star ⭐</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading reviews...</span>
          </div>
        )}

        {/* Reviews Cards List */}
        {!loading && (
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 text-xs font-medium">
                No client reviews found matching criteria.
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const gigTitle =
                  ordersMap[rev.orderId] || `Service Order #${rev.orderId}`;
                const ratingNum = rev.rating || 5;

                return (
                  <div
                    key={rev.id}
                    className="p-6 bg-gray-50/70 hover:bg-gray-50 border border-gray-100 rounded-2xl transition space-y-4 shadow-sm"
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
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-100">
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
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
