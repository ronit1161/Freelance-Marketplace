import React from "react";
import { AlertCircle } from "lucide-react";

export default function GigDeleteModal({ isOpen, gig, onClose, onConfirm }) {
  if (!isOpen || !gig) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200">
        <div className="flex items-center gap-3 text-red-600">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Delete Gig</h3>
            <p className="text-xs text-gray-500">Confirm removal of your gig listing</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
          Are you sure you want to delete your gig <strong className="text-slate-900">"{gig.title}"</strong>? 
          <br /><br />
          <span className="text-gray-500 italic">This will remove the listing from public marketplace search.</span>
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
