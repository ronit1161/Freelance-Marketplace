import React from "react";
import { Edit3, Trash2, Star } from "lucide-react";

export default function GigTable({ filteredGigs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <th className="py-4 px-3">Thumbnail</th>
            <th className="py-4">Title</th>
            <th className="py-4">Category</th>
            <th className="py-4">Price</th>
            <th className="py-4">Delivery</th>
            <th className="py-4">Rating</th>
            <th className="py-4">Status</th>
            <th className="py-4 text-right px-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {filteredGigs.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-400 text-xs font-medium">
                No gigs found matching criteria.
              </td>
            </tr>
          ) : (
            filteredGigs.map((gig) => (
              <tr key={gig.id} className="hover:bg-gray-50/50 transition">
                {/* Thumbnail */}
                <td className="py-4 px-3">
                  <img
                    src={
                      gig.thumbnailUrl ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={gig.title}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80";
                    }}
                  />
                </td>

                {/* Title */}
                <td className="py-4 font-bold text-slate-900 max-w-xs truncate">
                  {gig.title}
                </td>

                {/* Category */}
                <td className="py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                    {gig.categoryName || "General"}
                  </span>
                </td>

                {/* Price */}
                <td className="py-4 font-bold text-emerald-600">
                  ₹{gig.price}
                </td>

                {/* Delivery Days */}
                <td className="py-4 text-slate-600 text-xs font-medium">
                  {gig.deliveryDays ? `${gig.deliveryDays} Days` : "N/A"}
                </td>

                {/* Rating */}
                <td className="py-4">
                  <span className="inline-flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                  </span>
                </td>

                {/* Status */}
                <td className="py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      gig.isDeleted
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {gig.isDeleted ? "Inactive" : "Active"}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 text-right px-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(gig)}
                      className="px-3 py-1.5 bg-blue-50 text-[#0058be] border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onDelete(gig)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition flex items-center gap-1.5"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
