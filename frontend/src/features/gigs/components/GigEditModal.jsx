import React from "react";
import { X, AlertCircle } from "lucide-react";

export default function GigEditModal({
  isOpen,
  gig,
  categories,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editPrice,
  setEditPrice,
  editDeliveryDays,
  setEditDeliveryDays,
  editThumbnailUrl,
  setEditThumbnailUrl,
  editCategoryId,
  setEditCategoryId,
  savingEdit,
  editFormError,
  onClose,
  onSubmit,
}) {
  if (!isOpen || !gig) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Edit Gig</h3>
            <p className="text-xs text-gray-500">Update your service details and pricing.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-slate-900 transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {editFormError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{editFormError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Gig Title
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Delivery (Days)
              </label>
              <input
                type="number"
                min="1"
                required
                value={editDeliveryDays}
                onChange={(e) => setEditDeliveryDays(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows="4"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              value={editThumbnailUrl}
              onChange={(e) => setEditThumbnailUrl(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="flex-1 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-semibold text-xs transition shadow-sm disabled:opacity-50"
            >
              {savingEdit ? "Saving..." : "Update Gig"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
