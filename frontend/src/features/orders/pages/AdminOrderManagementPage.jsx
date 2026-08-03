import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../../services/orderApi";
import { deleteOrderByAdmin } from "../../../services/adminApi";
import {
  ShoppingBag,
  Search,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Filter,
  User,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";

export default function AdminOrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Search & Filter States
  const [searchOrderId, setSearchOrderId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Read-only Details Modal State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    order: null,
  });

  useEffect(() => {
    loadAllOrders();
  }, []);

  const loadAllOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError(err?.message || "Failed to load orders data.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Handle Delete Confirmation Modal Open
  const handleOpenDeleteModal = (order) => {
    setError("");
    setDeleteModal({
      isOpen: true,
      order,
    });
  };

  // Handle Delete Action
  const handleConfirmDelete = async () => {
    const order = deleteModal.order;
    if (!order) return;

    setDeleteModal({ isOpen: false, order: null });
    setError("");

    try {
      await deleteOrderByAdmin(order.id);
      showSuccess(`Order #${order.id} deleted successfully.`);
      await loadAllOrders();
    } catch (err) {
      console.error("Delete order error:", err);
      setError(err?.message || `Failed to delete order #${order.id}.`);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchOrderId.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      String(order.id).includes(searchLower) ||
      (order.gigTitle || "").toLowerCase().includes(searchLower) ||
      (order.clientName || "").toLowerCase().includes(searchLower) ||
      (order.freelancerName || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" ||
      (order.status || "").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Helper for Status Badge Styling
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
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <ShoppingBag size={16} />
            <span>Admin Module</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitor client orders, track escrow states, review requirements, and remove order records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
          >
            ← Back to Admin
          </Link>
          <button
            onClick={loadAllOrders}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      {/* Success / Error Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search by Order ID / Keyword */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Client, or Gig..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Status Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-4 border border-gray-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading orders...</span>
          </div>
        )}

        {/* Orders Data Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-3">Order ID</th>
                  <th className="py-4">Gig Title</th>
                  <th className="py-4">Client Name</th>
                  <th className="py-4">Freelancer Name</th>
                  <th className="py-4">Order Amount</th>
                  <th className="py-4">Order Status</th>
                  <th className="py-4">Order Date</th>
                  <th className="py-4 text-right px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400 text-xs font-medium">
                      No orders found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition">
                        {/* Order ID */}
                        <td className="py-4 px-3 font-mono text-xs font-bold text-slate-600">
                          #{order.id}
                        </td>

                        {/* Gig Title */}
                        <td className="py-4 font-bold text-slate-900 max-w-xs truncate">
                          {order.gigTitle || `Gig #${order.gigId}`}
                        </td>

                        {/* Client Name */}
                        <td className="py-4 text-slate-700 font-medium">
                          {order.clientName || `Client #${order.clientId}`}
                        </td>

                        {/* Freelancer Name */}
                        <td className="py-4 text-slate-600">
                          {order.freelancerName || `Freelancer #${order.freelancerId}`}
                        </td>

                        {/* Order Amount */}
                        <td className="py-4 font-bold text-blue-600">
                          ₹{order.agreedPrice}
                        </td>

                        {/* Order Status */}
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* Order Date */}
                        <td className="py-4 text-slate-500 text-xs font-medium">
                          {order.createdOn || "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right px-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-3 py-1.5 bg-blue-50 text-[#0058be] border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => handleOpenDeleteModal(order)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition flex items-center gap-1.5"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* READ-ONLY ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
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
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-slate-900 transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status & Amount Highlight Bar */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Current Status
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
                  Order Amount
                </span>
                <span className="font-bold text-blue-600 text-base">
                  ₹{selectedOrderDetails.agreedPrice}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-4 text-xs">
              {/* Gig Info */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>Gig Information</span>
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedOrderDetails.gigTitle || `Gig #${selectedOrderDetails.gigId}`}
                </p>
                <p className="text-slate-500 font-mono">Gig ID: #{selectedOrderDetails.gigId}</p>
              </div>

              {/* Client & Freelancer Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <User size={12} />
                    <span>Client Information</span>
                  </span>
                  <p className="font-bold text-slate-900">
                    {selectedOrderDetails.clientName || `Client #${selectedOrderDetails.clientId}`}
                  </p>
                  <p className="text-slate-500 font-mono">Client ID: #{selectedOrderDetails.clientId}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <User size={12} />
                    <span>Freelancer Information</span>
                  </span>
                  <p className="font-bold text-slate-900">
                    {selectedOrderDetails.freelancerName || `Freelancer #${selectedOrderDetails.freelancerId}`}
                  </p>
                  <p className="text-slate-500 font-mono">Freelancer ID: #{selectedOrderDetails.freelancerId}</p>
                </div>
              </div>

              {/* Project Requirements */}
              <div className="space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <FileText size={12} />
                  <span>Project Requirements</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {selectedOrderDetails.requirements || "No custom requirements specified for this order."}
                </p>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Order Created Date
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedOrderDetails.createdOn || "N/A"}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Last Updated Date
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
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && deleteModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Order Record</h3>
                <p className="text-xs text-gray-500">Confirm order removal from database</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
              Are you sure you want to delete Order <strong className="text-slate-900">#{deleteModal.order.id}</strong> (Gig: "{deleteModal.order.gigTitle}")? 
              <br /><br />
              <span className="text-gray-500 italic">This action removes the record from administrative history logs.</span>
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, order: null })}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs transition shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
