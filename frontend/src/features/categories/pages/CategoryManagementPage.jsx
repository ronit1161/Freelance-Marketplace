import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryApi";
import { getAllActiveGigs } from "../../../services/gigApi";
import {
  FolderTree,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Layers,
} from "lucide-react";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null,
  });

  useEffect(() => {
    loadCategoryData();
  }, []);

  const loadCategoryData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoriesData, gigsData] = await Promise.all([
        getAllCategories(),
        getAllActiveGigs().catch(() => []),
      ]);
      setCategories(categoriesData || []);
      setGigs(gigsData || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setError(err?.message || "Failed to load category data.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Helper to count gigs assigned to a category
  const getGigCount = (categoryId) => {
    return gigs.filter(
      (g) => String(g.categoryId) === String(categoryId) || g.categoryName === categories.find(c => c.id === categoryId)?.categoryName
    ).length;
  };

  // Handle Add/Edit Modal Open
  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryNameInput(category ? (category.categoryName || category.name || "") : "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryNameInput("");
    setEditingCategory(null);
  };

  // Handle Form Submit
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    const trimmedName = categoryNameInput.trim();
    if (!trimmedName) {
      setFormError("Category name cannot be empty.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, trimmedName);
        showSuccess(`Category "${trimmedName}" updated successfully.`);
      } else {
        await createCategory(trimmedName);
        showSuccess(`Category "${trimmedName}" created successfully.`);
      }
      handleCloseModal();
      await loadCategoryData();
    } catch (err) {
      console.error("Save category error:", err);
      setFormError(err?.message || "Failed to save category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirmation Modal Open
  const handleOpenDeleteModal = (category) => {
    setError("");
    setDeleteModal({
      isOpen: true,
      category,
    });
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    const category = deleteModal.category;
    if (!category) return;

    setDeleteModal({ isOpen: false, category: null });
    setError("");

    try {
      await deleteCategory(category.id);
      const catName = category.categoryName || category.name || "";
      showSuccess(`Category "${catName}" deleted successfully.`);
      await loadCategoryData();
    } catch (err) {
      console.error("Delete category error:", err);
      const catName = category.categoryName || category.name || "";
      setError(err?.message || `Cannot delete category "${catName}".`);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((c) =>
    (c.categoryName || c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <FolderTree size={16} />
            <span>Admin Module</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, edit, and audit marketplace categories and gig assignments.
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
            onClick={() => handleOpenModal(null)}
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Add Category</span>
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

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        {/* Search & Stats Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search category by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
            <button
              onClick={loadCategoryData}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition"
              title="Refresh List"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            </button>
            <span>Total Categories: <strong className="text-slate-900">{categories.length}</strong></span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading categories...</span>
          </div>
        )}

        {/* Categories Data Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-3">ID</th>
                  <th className="py-4">Category Name</th>
                  <th className="py-4">Gigs Assigned</th>
                  <th className="py-4 text-right px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400 text-xs font-medium">
                      No categories found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => {
                    const gigCount = getGigCount(cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-3 font-mono text-xs text-slate-500">#{cat.id}</td>
                        <td className="py-4 font-bold text-slate-900">{cat.categoryName || cat.name}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <Layers size={12} />
                            <span>{gigCount} {gigCount === 1 ? "Gig" : "Gigs"}</span>
                          </span>
                        </td>
                        <td className="py-4 text-right px-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(cat)}
                              className="px-3 py-1.5 bg-blue-50 text-[#0058be] border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleOpenDeleteModal(cat)}
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

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-xs text-gray-500">Category names must be unique across the platform.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-900 transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCategory} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Development, Graphic Design"
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-semibold text-xs transition shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && deleteModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Category</h3>
                <p className="text-xs text-gray-500">Confirm category removal from system database</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
              Are you sure you want to delete category <strong className="text-slate-900">"{deleteModal.category.categoryName || deleteModal.category.name}"</strong>? 
              <br /><br />
              <span className="text-gray-500 italic">Note: Categories with assigned active Gigs cannot be deleted.</span>
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, category: null })}
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
