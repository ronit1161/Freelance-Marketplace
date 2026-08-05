import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getClientOrders } from "../../../services/orderApi";
import { getWalletByUserId } from "../../../services/walletapi";
import ClientHeader from "../Components/ClientHeader";
import ClientMetricsGrid from "../Components/ClientMetricsGrid";

export default function ClientDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadClientDashboardData();
    }
  }, [user?.id]);

  const loadClientDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersData, walletData] = await Promise.all([
        getClientOrders(user.id).catch(() => []),
        getWalletByUserId(user.id).catch(() => null),
      ]);

      setOrders(ordersData || []);
      setWallet(walletData);
    } catch (err) {
      console.error("Failed to load client dashboard:", err);
      setError(err?.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  // Metrics Calculations
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => {
    const st = (o.status || "").toUpperCase();
    return st === "PENDING" || st === "ACCEPTED" || st === "IN_PROGRESS";
  }).length;

  const completedOrders = orders.filter(
    (o) => (o.status || "").toUpperCase() === "COMPLETED"
  ).length;

  const cancelledOrders = orders.filter(
    (o) => (o.status || "").toUpperCase() === "CANCELLED"
  ).length;

  const walletBalance = wallet
    ? (wallet.availableBalance ?? wallet.totalBalance ?? wallet.balance ?? "0.00")
    : "0.00";

  const totalSpent = orders
    .filter((o) => (o.status || "").toUpperCase() === "COMPLETED")
    .reduce((sum, o) => sum + (parseFloat(o.agreedPrice) || 0), 0)
    .toFixed(2);

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Hero Welcome Banner */}
      <ClientHeader
        userName={user?.fullName}
        onRefresh={loadClientDashboardData}
      />

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Overview Metrics Grid */}
      <ClientMetricsGrid
        totalOrders={totalOrders}
        activeOrders={activeOrders}
        completedOrders={completedOrders}
        cancelledOrders={cancelledOrders}
        walletBalance={walletBalance}
        totalSpent={totalSpent}
      />

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Track status and details of your recent service purchases
            </p>
          </div>
          <Link
            to="/client/orders"
            className="text-xs font-bold text-[#0058be] hover:underline"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs font-medium">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs font-medium space-y-3">
            <p>You haven't placed any marketplace orders yet.</p>
            <Link
              to="/gigs"
              className="inline-block px-4 py-2 bg-[#0058be] text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Browse Marketplace Gigs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-3">Order ID</th>
                  <th className="py-3.5">Gig Title</th>
                  <th className="py-3.5">Freelancer</th>
                  <th className="py-3.5">Price</th>
                  <th className="py-3.5">Status</th>
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
                      <td className="py-3.5 text-slate-600 text-xs">
                        {ord.freelancerName || `Freelancer #${ord.freelancerId}`}
                      </td>
                      <td className="py-3.5 font-bold text-blue-600">
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
