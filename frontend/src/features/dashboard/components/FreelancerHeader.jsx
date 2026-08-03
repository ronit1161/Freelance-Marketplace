import React from "react";
import { Link } from "react-router-dom";

export default function FreelancerHeader({ userName, onRefresh, loading }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="text-xs text-[#0058be] font-bold uppercase tracking-wider block mb-1">
          Freelancer Console
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Welcome back, {userName || "Freelancer"}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track active orders, manage your service gigs, and monitor earnings.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/freelancer/create-gig"
          className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-md transition"
        >
          Create New Gig
        </Link>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
