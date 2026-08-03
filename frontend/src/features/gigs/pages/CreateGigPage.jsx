import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createGig } from "../../../services/gigApi";
import { getAllCategories } from "../../../services/categoryApi";
import {
  PlusCircle,
  FolderTree,
  DollarSign,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Eye,
} from "lucide-react";

export default function CreateGig() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Preset sample thumbnails for quick 1-click selection
  const sampleThumbnails = [
    { label: "Web Dev", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" },
    { label: "Design", url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80" },
    { label: "Mobile App", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80" },
    { label: "Marketing", url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80" },
  ];

  useEffect(() => {
    setCategoriesLoading(true);
    getAllCategories()
      .then((data) => {
        setCategories(data || []);
        if (data && data.length > 0) {
          setCategoryId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setError("Failed to load categories list.");
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validations according to business rules
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedThumbnail = thumbnailUrl.trim();
    const parsedPrice = parseFloat(price);
    const parsedDays = parseInt(deliveryDays, 10);

    if (!trimmedTitle) {
      setError("Gig title is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!trimmedDescription) {
      setError("Description is required.");
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (isNaN(parsedDays) || parsedDays <= 0) {
      setError("Delivery Days must be greater than zero.");
      return;
    }

    if (!trimmedThumbnail) {
      setError("Thumbnail Image URL is required.");
      return;
    }

    setLoading(true);
    try {
      await createGig({
        title: trimmedTitle,
        description: trimmedDescription,
        price: parsedPrice,
        deliveryDays: parsedDays,
        thumbnailUrl: trimmedThumbnail,
        categoryId: parseInt(categoryId, 10),
        freelancerId: user?.id,
      });

      setSuccessMessage("Gig created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/freelancer/gigs");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Failed to create Gig.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <Sparkles size={16} />
            <span>Service Creation</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Gig</h1>
          <p className="text-gray-500 text-sm mt-1">
            Publish your digital service on the marketplace for global clients to order.
          </p>
        </div>

        <Link
          to="/freelancer"
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Gig Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Gig Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. I will build a modern responsive React web application"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              {categoriesLoading ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-xs flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-blue-600" />
                  <span>Loading categories...</span>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a category...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                required
                placeholder="Describe your service deliverables, features, and expectations in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Price & Delivery Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Price (₹ / Virtual Coins) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="e.g. 150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Delivery Time (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 3"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Thumbnail Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Thumbnail Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Sample Presets */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Quick Sample Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleThumbnails.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbnailUrl(sample.url)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-[#0058be] border border-gray-200 rounded-lg text-[10px] font-semibold text-slate-700 transition"
                    >
                      + {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Publishing Gig...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Publish Gig</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Eye size={16} className="text-[#0058be]" />
            <span>Live Marketplace Preview</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4 space-y-4">
            {/* Image Preview Container */}
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-gray-100 relative border border-gray-100">
              {thumbnailUrl.trim() ? (
                <img
                  src={thumbnailUrl.trim()}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs space-y-2 p-4 text-center">
                  <ImageIcon size={32} />
                  <span>Thumbnail Preview</span>
                  <span className="text-[10px] text-gray-300">Image will display here</span>
                </div>
              )}

              {price && (
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-extrabold text-xs px-3 py-1 rounded-xl shadow-sm border border-gray-100">
                  ₹{price}
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                {categories.find((c) => String(c.id) === String(categoryId))?.categoryName || "Category"}
              </span>

              <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2">
                {title.trim() || "Your Service Title Will Appear Here"}
              </h4>

              <p className="text-xs text-gray-500 line-clamp-3">
                {description.trim() || "Your service description overview will appear here..."}
              </p>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>{deliveryDays || 3} Days Delivery</span>
              <span className="font-bold text-slate-900 font-mono">₹{price || "0"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}