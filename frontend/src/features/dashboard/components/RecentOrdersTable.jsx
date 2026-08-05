import React from "react";
import { Link } from "react-router-dom";

export default function RecentOrdersTable({
  orders,
  onAcceptOrder,
  onStartOrder,
  onDeliverWork,
}) {
  return (
    <div id="my-orders" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Client Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Review and manage incoming orders from marketplace clients
          </p>
        </div>
        <Link to="/freelancer/orders" className="text-xs font-bold text-[#0058be] hover:underline">
          View All ({orders.length}) →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs font-medium">
          No incoming client orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-3">Order ID</th>
                <th className="py-3.5">Gig Title</th>
                <th className="py-3.5">Client Name</th>
                <th className="py-3.5">Amount</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.slice(0, 5).map((ord) => {
                const st = (ord.status || "").toUpperCase();
                return (
                  <tr key={ord.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-3 font-mono text-xs font-bold text-slate-600">
                      #{ord.id}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 max-w-xs truncate">
                      {ord.gigTitle || `Gig #${ord.gigId}`}
                    </td>
                    <td className="py-3.5 text-slate-600 text-xs font-medium">
                      {ord.clientName || `Client #${ord.clientId}`}
                    </td>
                    <td className="py-3.5 font-bold text-blue-600 text-xs">
                      ₹{ord.agreedPrice}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          st === "PENDING"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : st === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : st === "IN_PROGRESS"
                            ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                            : st === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right px-3">
                      {st === "PENDING" && (
                        <button
                          onClick={() => onAcceptOrder(ord.id)}
                          className="px-3 py-1.5 bg-[#0058be] text-white rounded-xl text-xs font-bold hover:bg-[#004bb0] shadow-sm transition"
                        >
                          Accept Order
                        </button>
                      )}
                      {st === "ACCEPTED" && (
                        <button
                          onClick={() => onStartOrder(ord.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm transition"
                        >
                          Start Work
                        </button>
                      )}
                      {st === "IN_PROGRESS" && (
                        <button
                          onClick={() => onDeliverWork(ord.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm transition"
                        >
                          Deliver Work
                        </button>
                      )}
                      {st === "COMPLETED" && (
                        <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
