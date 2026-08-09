import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllActiveGigs } from "../../../services/gigApi";
import { deleteGigByAdmin } from "../../../services/adminApi";
import { getAllCategories } from "../../../services/categoryApi";
import { getAllUsers } from "../../../services/userApi";
import {
  Briefcase,
  Search,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  User,
  FolderTree,
} from "lucide-react";

export default function AdminGigManagementPage() {
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filters State
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedFreelancer, setSelectedFreelancer] = useState("ALL");

  // Read-only Details Modal State
  const [selectedGigDetails, setSelectedGigDetails] = useState(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    gig: null,
  });

  useEffect(() => {
    loadAllGigData();
  }, []);

  const loadAllGigData = async () => {
    setLoading(true);
    setError("");
    try {
      const [gigsData, categoriesData, usersData] = await Promise.all([
        getAllActiveGigs().catch(() => []),
        getAllCategories().catch(() => []),
        getAllUsers().catch(() => []),
      ]);

      setGigs(gigsData || []);
      setCategories(categoriesData || []);

      // Extract unique freelancers from users or gigs
      const freelancerUsers = (usersData || []).filter(
        (u) => (u.role || "").toUpperCase() === "FREELANCER"
      );
      setFreelancers(freelancerUsers);
    } catch (err) {
      console.error("Failed to load gigs data", err);
      setError(err?.message || "Failed to load gigs data.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Handle Delete Confirmation Modal Open
  const handleOpenDeleteModal = (gig) => {
    setError("");
    setDeleteModal({
      isOpen: true,
      gig,
    });
  };

  // Handle Delete Action
  const handleConfirmDelete = async () => {
    const gig = deleteModal.gig;
    if (!gig) return;

    setDeleteModal({ isOpen: false, gig: null });
    setError("");

    try {
      await deleteGigByAdmin(gig.id);
      showSuccess(`Gig "${gig.title}" deleted successfully.`);
      await loadAllGigData();
    } catch (err) {
      console.error("Delete gig error:", err);
      setError(err?.message || `Failed to delete gig "${gig.title}".`);
    }
  };

  // Filtered Gigs
  const filteredGigs = gigs.filter((gig) => {
    const matchesTitle = (gig.title || "")
      .toLowerCase()
      .includes(searchTitle.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" ||
      String(gig.categoryId) === String(selectedCategory) ||
      (gig.categoryName || "").toLowerCase() === selectedCategory.toLowerCase();

    const matchesFreelancer =
      selectedFreelancer === "ALL" ||
      String(gig.freelancerId) === String(selectedFreelancer) ||
      (gig.freelancerName || "").toLowerCase() === selectedFreelancer.toLowerCase();

    return matchesTitle && matchesCategory && matchesFreelancer;
  });

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <Briefcase size={16} />
            <span>Admin Module</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Gig Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitor published freelancer gigs, review service offerings, and remove inappropriate listings.
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
            onClick={loadAllGigData}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search by Title */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search gig by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Category */}
          <div className="flex items-center gap-2">
            <FolderTree size={16} className="text-gray-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Freelancer */}
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400 shrink-0" />
            <select
              value={selectedFreelancer}
              onChange={(e) => setSelectedFreelancer(e.target.value)}
              className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Freelancers</option>
              {freelancers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.fullName || f.userName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading gigs...</span>
          </div>
        )}

        {/* Gigs Data Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-3">Gig Thumbnail</th>
                  <th className="py-4">Gig Title</th>
                  <th className="py-4">Freelancer</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Delivery</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredGigs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400 text-xs font-medium">
                      No gigs found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredGigs.map((gig) => {
                    return (
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

                        {/* Freelancer Name */}
                        <td className="py-4 text-slate-600 font-medium">
                          {gig.freelancerName || `Freelancer #${gig.freelancerId}`}
                        </td>

                        {/* Category */}
                        <td className="py-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
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
                              onClick={() => setSelectedGigDetails(gig)}
                              className="px-3 py-1.5 bg-blue-50 text-[#0058be] border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => handleOpenDeleteModal(gig)}
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

      {/* READ-ONLY GIG DETAILS MODAL */}
      {selectedGigDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#0058be] px-2.5 py-1 rounded-md">
                  Read-Only Gig Preview
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">
                  {selectedGigDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGigDetails(null)}
                className="text-gray-400 hover:text-slate-900 transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Thumbnail Image */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 h-48 w-full">
              <img
                src={
                  selectedGigDetails.thumbnailUrl ||
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                }
                alt={selectedGigDetails.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>

            {/* Key Information Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Freelancer
                </span>
                <span className="font-bold text-slate-900">
                  {selectedGigDetails.freelancerName || `ID #${selectedGigDetails.freelancerId}`}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Category
                </span>
                <span className="font-bold text-slate-900">
                  {selectedGigDetails.categoryName || "General"}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Service Price
                </span>
                <span className="font-bold text-emerald-600 text-sm">
                  ₹{selectedGigDetails.price}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Delivery Time
                </span>
                <span className="font-bold text-slate-900">
                  {selectedGigDetails.deliveryDays || 3} Days
                </span>
              </div>
            </div>

            {/* Gig Description */}
            <div className="space-y-1">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                Description
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {selectedGigDetails.description || "No description provided."}
              </p>
            </div>

            {/* Footer Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedGigDetails(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && deleteModal.gig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Inappropriate Gig</h3>
                <p className="text-xs text-gray-500">Confirm gig removal from marketplace</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
              Are you sure you want to permanently delete gig <strong className="text-slate-900">"{deleteModal.gig.title}"</strong> (# {deleteModal.gig.id})? 
              <br /><br />
              <span className="text-gray-500 italic">This will remove the listing from public search and marketplace catalog.</span>
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, gig: null })}
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
