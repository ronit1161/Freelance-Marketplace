import React from "react";
import { X, AlertCircle, RefreshCw } from "lucide-react";

export default function TopUpModal({
  isOpen,
  onClose,
  topUpAmount,
  setTopUpAmount,
  isSubmitting,
  formError,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Add Wallet Funds</h3>
            <p className="text-xs text-gray-500 mt-0.5">Top up virtual currency into your wallet</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-slate-900 p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Enter Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                required
                placeholder="e.g. 5000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Presets:</span>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopUpAmount(String(preset))}
                  className="py-2 bg-gray-50 hover:bg-blue-50 hover:text-[#0058be] border border-gray-200 rounded-xl text-xs font-bold text-slate-700 transition"
                >
                  +₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm Top-up</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
