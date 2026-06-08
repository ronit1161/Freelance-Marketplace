import  { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import GigCard from '../profile/GigList';
import GigDetailsView from '../profile/GigDetailsView';
import { gigsApi } from '../../Services/api';

export default function FreelancerMarketplace({ onBackClick }) {
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigs] = useState(gigsApi.getGigs());

  return (
    <div className="animate-in fade-in duration-200">
      {selectedGig ? (
        /* Isolated Deep Gig Specification View */
        <GigDetailsView 
          gig={selectedGig} 
          onBackClick={() => setSelectedGig(null)} 
        />
      ) : (
        /* Full-Width Card Marketplace Catalog View */
        <div className="space-y-6">
          
          {/* Isolated Top Actions Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <button 
                onClick={onBackClick}
                className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition mb-1.5"
              >
                <ArrowLeft size={16} /> <span>Go Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Freelancer Marketplace</h1>
              <p className="text-sm text-gray-500 mt-0.5">Direct global creative database profiles.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search freelancers or tags..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Multi-column grid taking advantage of the full container landscape layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {gigs.map((gig) => (
              <GigCard 
                key={gig.id} 
                gig={gig} 
                onSelect={(target) => setSelectedGig(target)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}