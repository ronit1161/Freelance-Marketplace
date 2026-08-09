import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createGig } from "../../../services/gigApi";
import { getAllCategories } from "../../../services/categoryApi";
import { generateGigWithAI } from "../../../services/aiApi";
import GigForm from "../components/GigForm";
import { CheckCircle2, AlertCircle, ArrowLeft, Sparkles, Wand2, RefreshCw, Bot, Send } from "lucide-react";

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

  // AI Service state
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState(false);

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

  const handleAiGenerate = async (e) => {
    if (e) e.preventDefault();
    const promptText = aiPrompt.trim();
    if (!promptText) {
      setAiError("Please enter a description or prompt for the AI generator.");
      return;
    }

    setAiError("");
    setAiGenerating(true);
    setAiSuccess(false);

    try {
      const data = await generateGigWithAI(promptText);

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.price) setPrice(data.price);
      if (data.deliveryDays) setDeliveryDays(data.deliveryDays);

      // Auto-match Category
      if (data.category && categories && categories.length > 0) {
        const target = data.category.toLowerCase();
        const matched = categories.find((cat) => {
          const catName = (cat.categoryName || cat.name || "").toLowerCase();
          return catName.includes(target) || target.includes(catName);
        });
        if (matched) {
          setCategoryId(matched.id);
        }
      }

      setAiSuccess(true);
    } catch (err) {
      setAiError(err.message || "Failed to generate Gig details using AI service.");
    } finally {
      setAiGenerating(false);
    }
  };

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
            <span>Gig Service Creation</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Gig</h1>
          <p className="text-gray-500 text-sm mt-1">
            Publish your digital service on the marketplace for global clients to order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/freelancer"
            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-slate-800 font-semibold rounded-xl text-xs transition flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Console</span>
          </Link>

          {/* Create Gig using AI Action Button */}
          <button
            id="toggle-ai-btn"
            type="button"
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles size={15} />
            <span>{showAiPanel ? "Close AI Assistant" : "Create Gig using AI"}</span>
          </button>
        </div>
      </div>

      {/* AI Prompt Generator Panel */}
      {showAiPanel && (
        <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200/80 shadow-sm space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#0058be] text-white rounded-lg shadow-sm">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  GENERATE YOUR GIG USING AI

                </h3>
                <p className="text-xs text-gray-600">
                  Describe what service you want to offer. The AI will automatically generate and fill out your gig details.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAiGenerate} className="space-y-3">
            <div>
              <label htmlFor="ai-prompt-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Input your idea here  <span className="text-[#0058be]">*</span>
              </label>
              <textarea
                id="ai-prompt-input"
                rows="3"
                placeholder="e.g., I want to offer a service creating responsive React websites with Tailwind CSS, custom components, fast delivery and SEO optimization..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full p-3.5 border border-blue-200 rounded-xl text-xs text-slate-900 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0058be] resize-none"
              />
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{aiError}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                id="generate-gig-ai-btn"
                type="submit"
                disabled={aiGenerating}
                className="px-5 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {aiGenerating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Generating Gig Details...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={15} />
                    <span>Generate Gig with AI</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}



      {/* AI Success Notification */}
      {aiSuccess && (
        <div className="p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#0058be]" />
            <span>Form fields automatically populated by AI! Please review and adjust the generated values below. <br />
              If researched Category is not found , First category is selected . Please Review carefully !
            </span>
          </div>
          <span className="text-[10px] bg-blue-200/60 text-blue-800 px-2 py-1 rounded-md font-bold uppercase">
            Auto-Filled
          </span>
        </div>
      )
      }


      {/* Messages */}
      {
        successMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )
      }

      {
        error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )
      }

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
    </div >
  );
}
