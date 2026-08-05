import React from "react";
import { Eye, Play, UploadCloud, CheckCircle2 } from "lucide-react";

export default function FreelancerOrderTable({
  filteredOrders,
  actionLoadingId,
  getStatusBadgeClass,
  onSelectOrderDetails,
  onAcceptOrder,
  onStartOrder,
  onCompleteOrder,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <th className="py-4 px-3">Order ID</th>
            <th className="py-4">Gig Title</th>
            <th className="py-4">Client Name</th>
            <th className="py-4">Amount</th>
            <th className="py-4">Status</th>
            <th className="py-4">Order Date</th>
            <th className="py-4 text-right px-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-400 text-xs font-medium">
                No received orders found matching criteria.
              </td>
            </tr>
          ) : (
            filteredOrders.map((ord) => {
              const statusUpper = (ord.status || "").toUpperCase();
              const isProcessingThis = actionLoadingId === ord.id;

              return (
                <tr key={ord.id} className="hover:bg-gray-50/50 transition">
                  {/* Order ID */}
                  <td className="py-4 px-3 font-mono text-xs font-bold text-slate-600">
                    #{ord.id}
                  </td>

                  {/* Gig Title */}
                  <td className="py-4 font-bold text-slate-900 max-w-xs truncate">
                    {ord.gigTitle || `Gig #${ord.gigId}`}
                  </td>

                  {/* Client Name */}
                  <td className="py-4 text-slate-700 font-medium">
                    {ord.clientName || `Client #${ord.clientId}`}
                  </td>

                  {/* Amount */}
                  <td className="py-4 font-bold text-blue-600">
                    ₹{ord.agreedPrice}
                  </td>

                  {/* Order Status */}
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  {/* Order Date */}
                  <td className="py-4 text-slate-500 text-xs font-medium">
                    {ord.createdOn || "N/A"}
                  </td>

                  {/* Actions according to sequence: PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED */}
                  <td className="py-4 text-right px-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Read-only View Details Button */}
                      <button
                        onClick={() => onSelectOrderDetails(ord)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-200 transition flex items-center gap-1"
                      >
                        <span>View</span>
                      </button>

                      {/* PENDING -> ACCEPTED */}
                      {statusUpper === "PENDING" && (
                        <button
                          onClick={() => onAcceptOrder(ord.id)}
                          disabled={isProcessingThis}
                          className="px-3.5 py-1.5 bg-[#0058be] text-white rounded-xl text-xs font-semibold hover:bg-[#004bb0] transition shadow-sm disabled:opacity-50"
                        >
                          {isProcessingThis ? "Accepting..." : "Accept Order"}
                        </button>
                      )}

                      {/* ACCEPTED -> IN_PROGRESS */}
                      {statusUpper === "ACCEPTED" && (
                        <button
                          onClick={() => onStartOrder(ord.id)}
                          disabled={isProcessingThis}
                          className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          <span>{isProcessingThis ? "Starting..." : "Start Order"}</span>
                        </button>
                      )}

                      {/* IN_PROGRESS -> COMPLETED */}
                      {statusUpper === "IN_PROGRESS" && (
                        <button
                          onClick={() => onCompleteOrder(ord.id)}
                          disabled={isProcessingThis}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          <span>{isProcessingThis ? "Completing..." : "Mark Completed"}</span>
                        </button>
                      )}

                      {/* COMPLETED State */}
                      {statusUpper === "COMPLETED" && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1">
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
