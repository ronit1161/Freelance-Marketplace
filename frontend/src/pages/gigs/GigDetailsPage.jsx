import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Clock, Zap, MessageSquare } from 'lucide-react';
import { gigsApi } from '../../services/api';

export default function GigDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);

  useEffect(() => {
    const fetchedGig = gigsApi.getGigs().find(g => g.id === id);
    setGig(fetchedGig);
  }, [id]);

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Gig not found</h2>
        <button 
          onClick={() => navigate('/gigs')}
          className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>
      </div>
    );
  }

  const ratingVal = gig.rating.split(' ')[0];
  const reviewsCount = gig.rating.split(' ')[1] ? gig.rating.split(' ')[1].replace('(', '') : '0';

  return (
    <div className="bg-gray-50 min-h-screen px-10 py-8 max-w-7xl m-auto animate-in fade-in duration-200">
      {/* Return Navigation */}
      <button 
        onClick={() => navigate('/gigs')}
        className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition mb-6"
      >
        <ArrowLeft size={16} /> <span>Back to Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Gig Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {gig.title}
            </h1>

            {/* Seller Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={gig.avatar}
                alt={gig.freelancer}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold text-slate-800">
                  {gig.freelancer}
                </h3>
                <div className="flex items-center space-x-1 text-amber-500 text-sm mt-0.5">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold text-slate-700">{ratingVal}</span>
                  <span className="text-gray-400">({reviewsCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Showcase Image */}
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=450&q=80"
              alt="Gig Service Showcase"
              className="w-full h-[400px] object-cover rounded-2xl shadow-sm mb-8"
            />

            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                About This Gig
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {gig.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Technical Stack</h4>
              <div className="flex flex-wrap gap-2">
                {gig.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Pricing & Contact Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="font-bold text-lg text-slate-950">
                Standard Package
              </h3>
              <span className="text-3xl font-extrabold text-blue-600">
                {gig.rate}
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Complete professional setup with high accessibility standard compliance, revisions, and production support.
            </p>

            <ul className="space-y-4 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2">⏱️ 3-5 Days Delivery</li>
              <li className="flex items-center gap-2">🔄 3 Revisions</li>
              <li className="flex items-center gap-2">🎨 Source File Included</li>
              <li className="flex items-center gap-2">💬 Commercial Use</li>
            </ul>

            <button className="w-full bg-[#0058be] hover:bg-[#004bb0] text-white py-3 rounded-xl transition font-semibold flex items-center justify-center space-x-2 shadow-sm">
              <Zap size={16} fill="currentColor" /> <span>Order Service Now</span>
            </button>

            <button className="w-full mt-4 border border-gray-200 hover:bg-gray-50 text-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition">
              <MessageSquare size={16} /> <span>Contact Seller</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
