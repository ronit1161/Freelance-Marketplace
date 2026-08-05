import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getReviewsForFreelancer } from "../../../services/reviewApi";
import { getFreelancerOrders } from "../../../services/orderApi";
import ReviewsStatsGrid from "../components/ReviewsStatsGrid";
import ReviewCardList from "../components/ReviewCardList";
import {
  Search,
  Filter,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
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

  const filteredReviews = reviews.filter((rev) => {
    const matchesClient = (rev.clientName || `Client #${rev.clientId}`)
      .toLowerCase()
      .includes(searchClientName.toLowerCase().trim());

    const matchesRating =
      ratingFilter === "ALL" || String(rev.rating) === String(ratingFilter);

    return matchesClient && matchesRating;
  });

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <span>Console</span>
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
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS FOR RATING INFORMATION */}
      <ReviewsStatsGrid
        avgRating={avgRating}
        totalReviews={totalReviews}
        fiveStarCount={fiveStarCount}
        positivePercentage={positivePercentage}
      />

      {/* Main Content Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        {/* Search & Rating Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading reviews...</span>
          </div>
        ) : (
          <ReviewCardList
            filteredReviews={filteredReviews}
            ordersMap={ordersMap}
          />
        )}
      </div>
    </div>
  );
}
