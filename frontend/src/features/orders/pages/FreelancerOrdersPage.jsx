import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  getFreelancerOrders,
  acceptOrder,
  startOrder,
  completeOrder,
} from "../../../services/orderApi";
import FreelancerOrderTable from "../components/FreelancerOrderTable";
import OrderDetailsModal from "../components/OrderDetailsModal";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export default function FreelancerOrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  // Search & Filter States
  const [searchOrderId, setSearchOrderId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Read-only Details Modal State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Status Action Loading ID
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadFreelancerOrdersData();
    }
  }, [user]);

  const loadFreelancerOrdersData = async () => {
    setLoading(true);
    setError("");
    try {
      const ordersData = await getFreelancerOrders(user.id);
      setOrders(ordersData || []);
    } catch (err) {
      console.error("Failed to load freelancer orders:", err);
      setError(err?.message || "Failed to load received orders.");
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const handleAcceptOrderAction = async (orderId) => {
    setActionLoadingId(orderId);
    setError("");
    try {
      await acceptOrder(orderId, user.id);
      showNotify(`Order #${orderId} accepted successfully!`);
      await loadFreelancerOrdersData();
    } catch (err) {
      console.error("Accept order error:", err);
      setError(err?.message || `Failed to accept Order #${orderId}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStartOrderAction = async (orderId) => {
    setActionLoadingId(orderId);
    setError("");
    try {
      await startOrder(orderId, user.id);
      showNotify(`Work started on Order #${orderId}!`);
      await loadFreelancerOrdersData();
    } catch (err) {
      console.error("Start order error:", err);
      setError(err?.message || `Failed to start Order #${orderId}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteOrderAction = async (orderId) => {
    setActionLoadingId(orderId);
    setError("");
    try {
      await completeOrder(orderId, user.id);
      showNotify(`Order #${orderId} marked as COMPLETED! Funds released to wallet.`);
      await loadFreelancerOrdersData();
    } catch (err) {
      console.error("Complete order error:", err);
      setError(err?.message || `Failed to complete Order #${orderId}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchOrderId.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      String(order.id).includes(searchLower) ||
      (order.gigTitle || "").toLowerCase().includes(searchLower) ||
      (order.clientName || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" ||
      (order.status || "").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const statusTabs = [
    { id: "ALL", label: "All Orders" },
    { id: "PENDING", label: "Pending" },
    { id: "ACCEPTED", label: "Accepted" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "COMPLETED", label: "Completed" },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <span>Freelancer Fulfillment</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Received Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track client project orders, progress order stages, and deliver completed work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/freelancer"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Console</span>
          </Link>
          <button
            onClick={loadFreelancerOrdersData}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Orders</span>
          </button>
        </div>
      </div>

      {/* Notifications / Errors */}
      {notification && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === tab.id
                ? "bg-[#0058be] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Order ID, Client, or Gig..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <span>Loading orders...</span>
          </div>
        ) : (
          <FreelancerOrderTable
            filteredOrders={filteredOrders}
            actionLoadingId={actionLoadingId}
            getStatusBadgeClass={getStatusBadgeClass}
            onSelectOrderDetails={setSelectedOrderDetails}
            onAcceptOrder={handleAcceptOrderAction}
            onStartOrder={handleStartOrderAction}
            onCompleteOrder={handleCompleteOrderAction}
          />
        )}
      </div>

      {/* READ-ONLY ORDER DETAILS MODAL */}
      <OrderDetailsModal
        selectedOrderDetails={selectedOrderDetails}
        getStatusBadgeClass={getStatusBadgeClass}
        onClose={() => setSelectedOrderDetails(null)}
      />
    </div>
  );
}
