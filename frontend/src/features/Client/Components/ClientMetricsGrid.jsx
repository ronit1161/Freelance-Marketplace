import React from "react";
import { Link } from "react-router-dom";

export default function ClientMetricsGrid({
  totalOrders,
  activeOrders,
  completedOrders,
  cancelledOrders,
  walletBalance,
  totalSpent,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Total Orders</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">{totalOrders}</h2>
        <p className="text-[10px] text-gray-400 mt-1">Services purchased</p>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Active Orders</p>
        <h2 className="text-3xl font-bold text-indigo-600 mt-1">{activeOrders}</h2>
        <p className="text-[10px] text-gray-400 mt-1">In fulfillment pipeline</p>
      </div>

      {/* Completed Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Completed Orders</p>
        <h2 className="text-3xl font-bold text-emerald-600 mt-1">{completedOrders}</h2>
        <p className="text-[10px] text-gray-400 mt-1">Delivered & signed off</p>
      </div>

      {/* Cancelled Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Cancelled Orders</p>
        <h2 className="text-3xl font-bold text-red-500 mt-1">{cancelledOrders}</h2>
        <p className="text-[10px] text-gray-400 mt-1">Refunded orders</p>
      </div>

      {/* Wallet Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Wallet Balance</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">₹{walletBalance}</h2>
        <Link to="/client/wallet" className="text-xs text-[#0058be] font-bold hover:underline mt-1 inline-block">
          Top Up Wallet →
        </Link>
      </div>

      {/* Total Amount Spent */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 font-medium text-xs">Total Amount Spent</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">₹{totalSpent}</h2>
        <p className="text-[10px] text-gray-400 mt-1">Completed order payments</p>
      </div>
    </div>
  );
}
