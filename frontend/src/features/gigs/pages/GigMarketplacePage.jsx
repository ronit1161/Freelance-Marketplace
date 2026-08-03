import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import GigCard from "../components/GigCard";
import { getAllActiveGigs } from "../../../services/gigApi";

export default function GigMarketplacePage() {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async (category = null, search = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllActiveGigs(category, search);
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
    fetchGigs(null, term);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 animate-in fade-in duration-200">
      <div className="space-y-6">
        {/* Top Actions Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Freelancer Marketplace</h1>
            <p className="text-sm text-gray-500 mt-0.5">Explore premium global talent profiles and select your partners.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search gigs by title..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>
        </div>

        {loading && <div className="text-center py-10 text-slate-600 font-medium">Loading active Gigs...</div>}
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}

        {!loading && !error && gigs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-slate-800">No Gigs Available</h3>
            <p className="text-sm text-slate-500 mt-1">Be the first freelancer to post a Gig!</p>
          </div>
        )}

        {/* Multi-column grid catalog */}
        {!loading && gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {gigs.map((gig) => (
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
