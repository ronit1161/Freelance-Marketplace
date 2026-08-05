import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getGigsByFreelancer, updateGig, deleteGig } from "../../../services/gigApi";
import { getAllCategories } from "../../../services/categoryApi";
import {
  Layers,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Filter,
  FolderTree,
  Clock,
  Star,
  ArrowRight,
  Eye,
} from "lucide-react";

export default function MyGigsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filters State
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Edit Modal State
  const [editModal, setEditModal] = useState({
    isOpen: false,
    gig: null,
  });
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState(3);
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    gig: null,
  });

  useEffect(() => {
    if (user?.id) {
      loadFreelancerGigsData();
    }
  }, [user]);

  const loadFreelancerGigsData = async () => {
    setLoading(true);
    setError("");
    try {
      const [gigsData, categoriesData] = await Promise.all([
        getGigsByFreelancer(user.id).catch(() => []),
        getAllCategories().catch(() => []),
      ]);

      setGigs(gigsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("Failed to load freelancer gigs:", err);
      setError(err?.message || "Failed to load your gigs data.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Open Edit Modal
  const handleOpenEditModal = (gig) => {
    setEditFormError("");
    setEditTitle(gig.title || "");
    setEditDescription(gig.description || "");
    setEditPrice(gig.price || "");
    setEditDeliveryDays(gig.deliveryDays || 3);
    setEditThumbnailUrl(gig.thumbnailUrl || "");
    setEditCategoryId(gig.categoryId || (categories.length > 0 ? categories[0].id : ""));
    setEditModal({
      isOpen: true,
      gig,
    });
  };

  // Submit Edit Form
  const handleSaveEditGig = async (e) => {
    e.preventDefault();
    if (!editModal.gig) return;

    if (!editTitle.trim()) {
      setEditFormError("Title cannot be empty.");
      return;
    }

    setSavingEdit(true);
    setEditFormError("");

    try {
      await updateGig(editModal.gig.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        price: parseFloat(editPrice),
        deliveryDays: parseInt(editDeliveryDays, 10),
        thumbnailUrl: editThumbnailUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        categoryId: parseInt(editCategoryId, 10),
        freelancerId: user?.id,
      });

      showSuccess(`Gig "${editTitle}" updated successfully.`);
      setEditModal({ isOpen: false, gig: null });
      await loadFreelancerGigsData();
    } catch (err) {
      console.error("Error updating gig:", err);
      setEditFormError(err?.message || "Failed to update gig.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (gig) => {
    setError("");
    setDeleteModal({
      isOpen: true,
      gig,
    });
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    const gig = deleteModal.gig;
    if (!gig) return;

    setDeleteModal({ isOpen: false, gig: null });
    setError("");

    try {
      await deleteGig(gig.id);
      showSuccess(`Gig "${gig.title}" deleted successfully.`);
      await loadFreelancerGigsData();
    } catch (err) {
      console.error("Error deleting gig:", err);
      setError(err?.message || `Failed to delete gig "${gig.title}".`);
    }
  };

  // Filter Gigs
  const filteredGigs = gigs.filter((gig) => {
    const matchesTitle = (gig.title || "")
      .toLowerCase()
      .includes(searchTitle.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === "ALL" ||
      String(gig.categoryId) === String(selectedCategory) ||
      (gig.categoryName || "").toLowerCase() === selectedCategory.toLowerCase();

    return matchesTitle && matchesCategory;
  });

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <Layers size={16} />
            <span>Freelancer Services</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">My Published Gigs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your service offerings, edit pricing, and track public listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/freelancer"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
          >
            ← Back to Console
          </Link>
          <Link
            to="/freelancer/create-gig"
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Create Gig</span>
          </Link>
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
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search by Title */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search my gigs by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Category Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
              <FolderTree size={16} className="text-gray-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs text-slate-800 bg-transparent focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadFreelancerGigsData}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition"
              title="Refresh Gigs"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading your gigs...</span>
          </div>
        )}

        {/* My Gigs Data Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-3">Thumbnail</th>
                  <th className="py-4">Title</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Delivery</th>
                  <th className="py-4">Rating</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Created Date</th>
                  <th className="py-4 text-right px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredGigs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400 text-xs font-medium">
                      No gigs found matching criteria.
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

                        {/* Created Date */}
                        <td className="py-4 text-slate-500 text-xs font-medium">
                          {gig.createdOn || "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right px-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(gig)}
                              className="px-3 py-1.5 bg-blue-50 text-[#0058be] border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
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

      {/* EDIT GIG MODAL */}
      {editModal.isOpen && editModal.gig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Edit Gig</h3>
                <p className="text-xs text-gray-500">Update your service details and pricing.</p>
              </div>
              <button
                onClick={() => setEditModal({ isOpen: false, gig: null })}
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

            <form onSubmit={handleSaveEditGig} className="space-y-4 text-xs">
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
                  onClick={() => setEditModal({ isOpen: false, gig: null })}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-semibold text-xs transition shadow-md disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Update Gig"}
                </button>
              </div>
            </form>
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
                <h3 className="font-bold text-slate-900 text-base">Delete Gig</h3>
                <p className="text-xs text-gray-500">Confirm removal of your gig listing</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
              Are you sure you want to delete your gig <strong className="text-slate-900">"{deleteModal.gig.title}"</strong>? 
              <br /><br />
              <span className="text-gray-500 italic">This will remove the listing from public marketplace search.</span>
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
