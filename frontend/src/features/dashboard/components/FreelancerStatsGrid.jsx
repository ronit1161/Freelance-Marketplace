import React from "react";
import { Link } from "react-router-dom";

export default function FreelancerStatsGrid({
  totalGigs,
  activeGigs,
  totalOrders,
  pendingOrders,
  completedOrders,
  avgRating,
  reviewsCount,
  walletBalance,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Active Gigs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Active Gigs</p>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{activeGigs}</h2>
        <p className="text-[10px] text-gray-400 mt-1">{totalGigs} total created</p>
      </div>

      {/* Pending Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Pending Orders</p>
        <h2 className="text-3xl font-extrabold text-amber-600 mt-1">{pendingOrders}</h2>
        <p className="text-[10px] text-gray-400 mt-1">Awaiting acceptance</p>
      </div>

      {/* Completed Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Completed Orders</p>
        <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{completedOrders}</h2>
        <p className="text-[10px] text-gray-400 mt-1">{totalOrders} total received</p>
      </div>

      {/* Available Wallet Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Wallet Balance</p>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">₹{walletBalance}</h2>
        <Link to="/freelancer/wallet" className="text-xs text-[#0058be] font-bold hover:underline mt-1 inline-block">
          View Ledger →
        </Link>
      </div>

      {/* Average Rating */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Average Rating</p>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
          {avgRating}
        </h2>
        <Link to="/freelancer/reviews" className="text-xs text-gray-500 font-medium hover:underline mt-1 inline-block">
          {reviewsCount} Client reviews →
        </Link>
      </div>
    </div>
  );
}
