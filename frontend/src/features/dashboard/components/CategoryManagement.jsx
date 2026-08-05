import { useState, useEffect } from "react";
import { 
  getAdminCategories, 
  createAdminCategory, 
  deleteAdminCategory 
} from "../../../Services/adminApi";

const CategoryManagement = ({ onCategoryCountChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminCategories();
      const list = data || [];
      setCategories(list);
      if (onCategoryCountChange) {
        onCategoryCountChange(list.length);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }
    if (trimmedName.length > 30) {
      setFormError("Category name must be at most 30 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      await createAdminCategory({ categoryName: trimmedName });
      setNewCategoryName("");
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to create category:", err);
      setFormError(err.response?.data?.message || "Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setDeletingId(id);
      await deleteAdminCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage platform categories</p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormError("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-10 text-center text-gray-500 text-sm">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="py-10 text-center text-gray-500 text-sm border border-dashed border-gray-200 rounded-lg">
          No categories created yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Ongoing Gigs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="py-3.5 px-4 font-medium text-gray-900">
                    {category.categoryName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-700">
                    {category.ongoingGigsCount ?? 0}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deletingId === category.id}
                      className="text-xs font-semibold px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                    >
                      {deletingId === category.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Category</h3>

            {formError && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
