// import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

export default function GigCard({ gig, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img className="w-12 h-12 rounded-full object-cover border border-gray-100" src={gig.avatar} alt={gig.freelancer} />
            <div>
              <h4 className="text-sm font-bold text-slate-800">{gig.freelancer}</h4>
              <div className="flex items-center space-x-1 text-amber-500 mt-0.5">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-semibold text-slate-600">{gig.rating}</span>
              </div>
            </div>
          </div>
          <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
            {gig.rate}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">{gig.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{gig.description}</p>
      </div>

      <div className="pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {gig.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="bg-gray-50 text-gray-500 font-semibold text-[10px] px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Click anywhere on the button shifts the parent view state completely */}
        <button 
          onClick={() => onSelect(gig)}
          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-4 py-2 rounded-full flex items-center space-x-1 transition"
        >
          <span>View Details</span> <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}