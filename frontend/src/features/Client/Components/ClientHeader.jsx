import React from "react";
import { Link } from "react-router-dom";

export default function ClientHeader({ userName, onRefresh }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="text-xs text-[#0058be] font-bold uppercase tracking-wider block mb-1">
          Client Suite
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Welcome back{userName ? `, ${userName}` : ""}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your service requests, track order progress, and check wallet balance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/gigs"
          className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-sm transition"
        >
          Browse Marketplace
        </Link>
        <button
          onClick={onRefresh}
          className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
