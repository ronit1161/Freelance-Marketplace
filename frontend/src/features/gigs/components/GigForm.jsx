import React from "react";
import { PlusCircle, RefreshCw } from "lucide-react";

export default function GigForm({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  deliveryDays,
  setDeliveryDays,
  thumbnailUrl,
  setThumbnailUrl,
  categoryId,
  setCategoryId,
  categories,
  categoriesLoading,
  loading,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
      <form onSubmit={onSubmit} className="space-y-6 text-xs">
        {/* Gig Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Gig Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Modern Responsive React Web Application Development"

            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          {categoriesLoading ? (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-xs flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-blue-600" />
              <span>Loading categories...</span>
            </div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select a category...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="5"
            required
            placeholder="Describe your service deliverables, features, and expectations in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        {/* Price & Delivery Days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="e.g. 150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Delivery Time (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 3"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Thumbnail Image URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Thumbnail Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            placeholder="https://images.unsplash.com/..."
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Publishing Gig...</span>
            </>
          ) : (
            <>
              <span className="text-sm">Publish Gig</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
