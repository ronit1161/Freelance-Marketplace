import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import GigCard from "../components/GigCard";
import { getAllActiveGigs } from "../../../services/gigApi";
import { getAllCategories } from "../../../services/categoryApi";

export default function GigMarketplacePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchGigs(selectedCategory, searchTerm);
  }, [selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchGigs = async (category = null, search = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllActiveGigs(category || null, search || null);
      setGigs(data || []);
    } catch (err) {
      console.error("Failed to fetch gigs", err);
      setError(err?.message || "Failed to load gigs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (term) updated.set("search", term);
      else updated.delete("search");
      return updated;
    });
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (cat) updated.set("category", cat);
      else updated.delete("category");
      return updated;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("default");
    setSearchParams({});
  };

  // Sort Gigs
  const sortedGigs = [...gigs].sort((a, b) => {
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    if (sortBy === "price_asc") return priceA - priceB;
    if (sortBy === "price_desc") return priceB - priceA;
    if (sortBy === "title_asc") return (a.title || "").localeCompare(b.title || "");
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Marketplace Services</h1>
          <p className="text-sm text-gray-500 mt-1">Browse, filter, and compare professional freelance offerings.</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search gigs by keyword..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Category Dropdown & Sort */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.categoryName || cat.name}>
                    {cat.categoryName || cat.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort by: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Title: A to Z</option>
            </select>

            {(searchTerm || selectedCategory || sortBy !== "default") && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1 border border-red-200"
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && <div className="text-center py-12 text-slate-600 font-medium text-sm">Loading active Gigs...</div>}
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold">{error}</div>}

        {/* Empty State */}
        {!loading && !error && sortedGigs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8 space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No Services Found</h3>
            <p className="text-sm text-slate-500">No gigs matched your current search or category filter.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#0058be] text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Gigs Grid */}
        {!loading && sortedGigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {sortedGigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={{
                  id: gig.id,
                  title: gig.title,
                  freelancer: gig.freelancerName || "Freelancer",
                  rate: `₹${gig.price}`,
                  rating: "5.0",
                  tags: [gig.categoryName || "Services"],
                  description: gig.description,
                  avatar: gig.thumbnailUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                }}
                onSelect={(target) => navigate(`/gigs/${target.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
