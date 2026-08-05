import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createGig } from "../../../services/gigApi";
import { getAllCategories } from "../../../services/categoryApi";
import GigForm from "../components/GigForm";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

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
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
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
          <span>Console</span>
        </Link>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <div>
        <GigForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          deliveryDays={deliveryDays}
          setDeliveryDays={setDeliveryDays}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          categories={categories}
          categoriesLoading={categoriesLoading}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}