import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getClientOrders } from "../../../services/orderApi";
import { getWalletByUserId } from "../../../services/walletapi";

export default function ClientDashboard() {
  const navigate = useNavigate();
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
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs text-[#0058be] font-bold uppercase tracking-wider block mb-1">
            Client Suite
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your service requests, track order progress, and check wallet balance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/gigs"
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-md transition"
          >
            Browse Marketplace
          </Link>
          <button
            onClick={loadClientDashboardData}
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* QUICK ACCESS CONTROLS BAR */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Quick Access Controls
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Link
            to="/gigs"
            className="p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-center transition block"
          >
            <span className="text-xs font-bold text-slate-800 block">Browse Gigs</span>
          </Link>

          <Link
            to="/client/orders"
            className="p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-center transition block"
          >
            <span className="text-xs font-bold text-slate-800 block">My Orders</span>
          </Link>

          <Link
            to="/client/wallet"
            className="p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-center transition block"
          >
            <span className="text-xs font-bold text-slate-800 block">Wallet</span>
          </Link>

          <Link
            to="/client/orders"
            className="p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-center transition block"
          >
            <span className="text-xs font-bold text-slate-800 block">Reviews</span>
          </Link>

          <Link
            to="/client/profile"
            className="p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-center transition block"
          >
            <span className="text-xs font-bold text-slate-800 block">Profile</span>
          </Link>
        </div>
      </div>

      {/* OVERVIEW SUMMARY CARDS (6 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-xs">Total Orders</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{totalOrders}</h2>
          <p className="text-[10px] text-gray-400 mt-1">Services purchased</p>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-xs">Active Orders</p>
          <h2 className="text-3xl font-extrabold text-indigo-600 mt-1">{activeOrders}</h2>
          <p className="text-[10px] text-gray-400 mt-1">In fulfillment pipeline</p>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-xs">Completed Orders</p>
          <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{completedOrders}</h2>
          <p className="text-[10px] text-gray-400 mt-1">Delivered & signed off</p>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-xs">Cancelled Orders</p>
          <h2 className="text-3xl font-extrabold text-red-500 mt-1">{cancelledOrders}</h2>
          <p className="text-[10px] text-gray-400 mt-1">Refunded orders</p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-xs">Wallet Balance</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">₹{walletBalance}</h2>
          <Link to="/client/wallet" className="text-xs text-[#0058be] font-bold hover:underline mt-1 inline-block">
            Top Up Wallet →
          </Link>
        </div>

        {/* Total Amount Spent */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-xs">Total Amount Spent</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">₹{totalSpent}</h2>
          <p className="text-[10px] text-gray-400 mt-1">Completed order payments</p>
        </div>
      </div>

      {/* RECENT ORDERS TABLE (Full Width) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-center">
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
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 text-xs font-medium space-y-3">
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
                <tr className="border-b border-gray-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-3">Order ID</th>
                  <th className="py-3.5">Gig Title</th>
                  <th className="py-3.5">Freelancer</th>
                  <th className="py-3.5">Price</th>
                  <th className="py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
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
