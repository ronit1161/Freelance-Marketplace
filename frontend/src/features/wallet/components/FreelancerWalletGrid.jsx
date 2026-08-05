import React from "react";
import { Coins, Lock, Wallet } from "lucide-react";

export default function FreelancerWalletGrid({ availableBal, heldBal, totalBal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Available Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">Available Balance</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            ₹{Number(availableBal).toFixed(2)}
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">Earned funds ready for payout</p>
        </div>
      </div>

      {/* Held Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">Held Balance</p>
          <h2 className="text-3xl font-extrabold text-amber-600 mt-1">
            ₹{Number(heldBal).toFixed(2)}
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">Pending order releases</p>
        </div>
      </div>

      {/* Total Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-xs">Total Balance</p>
          <h2 className="text-3xl font-extrabold text-[#0058be] mt-1">
            ₹{Number(totalBal).toFixed(2)}
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">Combined wallet valuation</p>
        </div>
      </div>
    </div>
  );
}
