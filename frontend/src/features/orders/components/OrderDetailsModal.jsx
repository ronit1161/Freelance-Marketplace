import React from "react";
import { X } from "lucide-react";

export default function OrderDetailsModal({
  selectedOrderDetails,
  getStatusBadgeClass,
  onClose,
}) {
  if (!selectedOrderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#0058be] px-2.5 py-1 rounded-md">
              Order Details Preview
            </span>
            <h3 className="font-bold text-slate-900 text-lg mt-1">
              Order #{selectedOrderDetails.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-slate-900 transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status & Amount Highlight Bar */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Current Stage Status
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                selectedOrderDetails.status
              )}`}
            >
              {selectedOrderDetails.status}
            </span>
          </div>

          <div className="text-right">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Agreed Payout
            </span>
            <span className="font-bold text-blue-600 text-base">
              ₹{selectedOrderDetails.agreedPrice}
            </span>
          </div>
        </div>

        {/* Information Grid */}
        <div className="space-y-4 text-xs">
          {/* Gig Info */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>Gig Service</span>
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {selectedOrderDetails.gigTitle || `Gig #${selectedOrderDetails.gigId}`}
            </p>
            <p className="text-slate-500 font-mono">Gig ID: #{selectedOrderDetails.gigId}</p>
          </div>

          {/* Client Info */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>Client Information</span>
            </span>
            <p className="font-bold text-slate-900">
              {selectedOrderDetails.clientName || `Client #${selectedOrderDetails.clientId}`}
            </p>
            <p className="text-slate-500 font-mono">Client ID: #{selectedOrderDetails.clientId}</p>
          </div>

          {/* Project Requirements */}
          <div className="space-y-1">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>Project Requirements</span>
            </span>
            <p className="text-xs text-slate-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
              {selectedOrderDetails.requirements || "No custom requirements specified for this order."}
            </p>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Order Created Date
              </span>
              <span className="font-semibold text-slate-900">
                {selectedOrderDetails.createdOn || "N/A"}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Last Stage Update
              </span>
              <span className="font-semibold text-slate-900">
                {selectedOrderDetails.lastUpdated
                  ? String(selectedOrderDetails.lastUpdated).replace("T", " ").substring(0, 19)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
