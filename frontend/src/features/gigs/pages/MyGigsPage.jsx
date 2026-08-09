import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getGigsByFreelancer, updateGig, deleteGig } from "../../../services/gigApi";
import { getAllCategories } from "../../../services/categoryApi";
import GigTable from "../components/GigTable";
import GigEditModal from "../components/GigEditModal";
import GigDeleteModal from "../components/GigDeleteModal";
import {
  Layers,
  PlusCircle,
  Search,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  ArrowLeft,
} from "lucide-react";

export default function MyGigsPage() {
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
  const [editModal, setEditModal] = useState({ isOpen: false, gig: null });
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState(3);
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, gig: null });

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

  const handleOpenEditModal = (gig) => {
    setEditFormError("");
    setEditTitle(gig.title || "");
    setEditDescription(gig.description || "");
    setEditPrice(gig.price || "");
    setEditDeliveryDays(gig.deliveryDays || 3);
    setEditThumbnailUrl(gig.thumbnailUrl || "");
    setEditCategoryId(gig.categoryId || (categories.length > 0 ? categories[0].id : ""));
    setEditModal({ isOpen: true, gig });
  };

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

  const handleOpenDeleteModal = (gig) => {
    setError("");
    setDeleteModal({ isOpen: true, gig });
  };

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
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Console</span>
          </Link>
          <Link
            to="/freelancer/create-gig"
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Create Gig</span>
          </Link>
        </div>
      </div>

      {/* Success / Error Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                    {cat.categoryName || cat.name}
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
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading your gigs...</span>
          </div>
        ) : (
          <GigTable
            filteredGigs={filteredGigs}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </div>

      {/* EDIT GIG MODAL */}
      <GigEditModal
        isOpen={editModal.isOpen}
        gig={editModal.gig}
        categories={categories}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editPrice={editPrice}
        setEditPrice={setEditPrice}
        editDeliveryDays={editDeliveryDays}
        setEditDeliveryDays={setEditDeliveryDays}
        editThumbnailUrl={editThumbnailUrl}
        setEditThumbnailUrl={setEditThumbnailUrl}
        editCategoryId={editCategoryId}
        setEditCategoryId={setEditCategoryId}
        savingEdit={savingEdit}
        editFormError={editFormError}
        onClose={() => setEditModal({ isOpen: false, gig: null })}
        onSubmit={handleSaveEditGig}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <GigDeleteModal
        isOpen={deleteModal.isOpen}
        gig={deleteModal.gig}
        onClose={() => setDeleteModal({ isOpen: false, gig: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
