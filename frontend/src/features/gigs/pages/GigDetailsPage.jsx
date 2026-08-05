import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getGigById } from "../../../services/gigApi";
import { getReviewsForFreelancer } from "../../../services/reviewApi";
import { getWalletByUserId } from "../../../services/walletapi";
import OrderCheckoutModal from "../components/OrderCheckoutModal";
import GigReviewsList from "../components/GigReviewsList";
import GigPackageCard from "../components/GigPackageCard";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function GigDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Order modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loginAlert, setLoginAlert] = useState("");

  useEffect(() => {
    if (id) {
      loadGigDetails();
    }
  }, [id]);

  useEffect(() => {
    if (user?.id) {
      getWalletByUserId(user.id)
        .then(setWallet)
        .catch(() => setWallet(null));
    }
  }, [user?.id]);

  const loadGigDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const numericId = Number(id);
      const apiGig = await getGigById(numericId);
      if (apiGig) {
        setGig(apiGig);
        if (apiGig.freelancerId) {
          const reviewsData = await getReviewsForFreelancer(apiGig.freelancerId).catch(() => []);
          setReviews(reviewsData || []);
        }
      } else {
        setError("Gig service offering not found.");
      }
    } catch (err) {
      console.error("Failed to load gig details:", err);
      setError(err?.message || "Failed to load gig details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderClick = () => {
    setLoginAlert("");
    if (!user) {
      setLoginAlert("You must be logged in as a Client to place an order.");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setIsCheckoutOpen(false);
    navigate("/client/orders");
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  const availableBalance = wallet?.availableBalance ?? wallet?.balance ?? 0;
  const gigPrice = Number(gig?.price || 0);
  const hasInsufficientFunds = user && availableBalance < gigPrice;

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Return Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/gigs")}
          className="flex items-center gap-2 text-xs font-bold text-[#0058be] hover:underline transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Browse Gigs</span>
        </button>

        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Marketplace Service Details
        </span>
      </div>

      {/* Login Alert Banner */}
      {loginAlert && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-semibold flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <span>{loginAlert}</span>
          </div>
          <Link
            to="/login"
            className="px-4 py-1.5 bg-[#0058be] text-white rounded-xl font-bold text-xs shadow-sm hover:bg-[#004bb0]"
          >
            Log In Now
          </Link>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20 text-slate-500 font-medium text-sm bg-white rounded-2xl border border-gray-200 p-8">
          Loading gig details...
        </div>
      )}

      {!loading && gig && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN - Main Gig Info & Showcase */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
              {/* Category & Title */}
              <div className="space-y-2">
                <span className="px-3 py-1 bg-blue-50 text-[#0058be] text-xs font-bold rounded-full uppercase tracking-wider">
                  {gig.categoryName || "General Service"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {gig.title}
                </h1>
              </div>

              {/* Freelancer Header */}
              <div className="flex items-center gap-4 border-t border-b border-gray-100 py-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0058be] font-extrabold text-lg flex items-center justify-center border border-blue-200 shrink-0">
                  {(gig.freelancerName || "F")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {gig.freelancerName || `Freelancer #${gig.freelancerId}`}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-0.5">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{avgRating}</span>
                    <span className="text-gray-400 font-normal">
                      ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Gig Thumbnail Showcase */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-80 w-full shadow-sm">
                <img
                  src={
                    gig.thumbnailUrl ||
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={gig.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>

              {/* Service Description */}
              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-bold text-slate-900">About This Service</h2>
                <p className="text-xs text-slate-700 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-200 whitespace-pre-line">
                  {gig.description || "No description provided."}
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Delivery Days
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Clock size={14} className="text-[#0058be]" />
                    <span>{gig.deliveryDays || 3} Days</span>
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Service Price
                  </span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ₹{gig.price}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs col-span-2 sm:col-span-1">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Escrow Protection
                  </span>
                  <span className="font-bold text-blue-600 flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>Guaranteed</span>
                  </span>
                </div>
              </div>
            </div>

            {/* CLIENT REVIEWS SECTION */}
            <GigReviewsList reviews={reviews} avgRating={avgRating} />
          </div>

          {/* RIGHT COLUMN - STICKY ORDER SUMMARY CARD */}
          <GigPackageCard
            gig={gig}
            user={user}
            availableBalance={availableBalance}
            hasInsufficientFunds={hasInsufficientFunds}
            onPlaceOrder={handlePlaceOrderClick}
          />
        </div>
      )}

      {/* Mandatory Checkout Modal */}
      {gig && (
        <OrderCheckoutModal
          gig={gig}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}
