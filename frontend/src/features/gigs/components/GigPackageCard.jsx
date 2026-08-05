import React from "react";
import { Link } from "react-router-dom";
import { Wallet, Clock, ShieldCheck, Zap, Lock } from "lucide-react";

export default function GigPackageCard({
  gig,
  user,
  availableBalance,
  hasInsufficientFunds,
  onPlaceOrder,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 sticky top-24 space-y-6">
        <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#0058be] px-2 py-0.5 rounded">
              Service Package
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">Standard Gig</h3>
          </div>
          <span className="text-3xl font-extrabold text-[#0058be]">
            ₹{gig.price}
          </span>
        </div>

        {/* Wallet Balance Preview */}
        {user && (
          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5 text-gray-500">
                <Wallet size={14} className="text-[#0058be]" /> Available Wallet Balance
              </span>
              <span className={`font-bold ${hasInsufficientFunds ? "text-red-600" : "text-emerald-600"}`}>
                ₹{Number(availableBalance).toFixed(2)}
              </span>
            </div>
            {hasInsufficientFunds && (
              <div className="text-[11px] text-red-600 font-medium pt-1 flex items-center justify-between">
                <span>Insufficient funds for this gig.</span>
                <Link to="/client/wallet" className="font-bold underline text-[#0058be]">Top Up</Link>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 leading-relaxed">
          Includes full service delivery, revision rounds, and secure escrow buyer protection.
        </p>

        <div className="space-y-3 text-xs text-slate-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Clock size={14} className="text-[#0058be]" /> Turnaround
            </span>
            <span className="font-bold text-slate-900">{gig.deliveryDays || 3} Days</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" /> Escrow Lock
            </span>
            <span className="font-bold text-emerald-600">100% Safe</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={onPlaceOrder}
          className="w-full bg-[#0058be] hover:bg-[#004bb0] text-white py-3.5 rounded-xl transition font-bold text-xs shadow-sm flex items-center justify-center gap-2"
        >
          <Zap size={16} fill="currentColor" />
          <span>Place Order Now</span>
        </button>

        <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <Lock size={12} />
          <span>Mandatory project requirements entered at checkout</span>
        </div>
      </div>
    </div>
  );
}
