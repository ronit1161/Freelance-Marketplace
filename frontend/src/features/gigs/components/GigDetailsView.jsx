// import React from 'react';
import { ArrowLeft, Star, ShieldCheck, Clock, Zap } from 'lucide-react';

export default function GigDetailsView({ gig, onBackClick }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Return Navigation Trigger */}
      <button 
        onClick={onBackClick}
        className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft size={16} /> <span>Back to Marketplace</span>
      </button>

      {/* Main Showcase Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column Profile Summary Card */}
        <div className="md:col-span-1 flex flex-col items-center text-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
          <img 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3" 
            src={gig.avatar} 
            alt={gig.freelancer} 
          />
          <h2 className="text-lg font-bold text-slate-900">{gig.freelancer}</h2>
          
          <div className="flex items-center space-x-1 text-amber-500 mt-1 mb-4">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold text-slate-700">{gig.rating.split(' ')[0]}</span>
            <span className="text-xs text-gray-400">({gig.rating.split(' ')[1].replace('(', '')} reviews)</span>
          </div>

          <div className="w-full space-y-2.5 border-t border-gray-100 pt-4 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Standard Rate:</span>
              <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{gig.rate}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Identity Status:</span>
              <span className="font-bold text-emerald-600 flex items-center space-x-0.5"><ShieldCheck size={12} /> <span>Verified</span></span>
            </div>
          </div>
        </div>

        {/* Right Column Core Gig Specifications Data */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
              Contract Placement Profile
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2.5 mb-3">{gig.title}</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{gig.description}</p>
            
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Core Technical Stack</h4>
            <div className="flex flex-wrap gap-2">
              {gig.tags.map((tag, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Trigger Package Row */}
          <div className="pt-6 border-t border-gray-100 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-gray-500">
              <Clock size={16} className="text-blue-500" />
              <div className="text-xs">
                <p className="font-bold text-slate-700">Average Turnaround</p>
                <p className="font-medium text-gray-400">3-5 Business Days</p>
              </div>
            </div>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition shadow-sm">
              <Zap size={16} fill="currentColor" /> <span>Initiate Direct Hire Contract</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}