import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import GigCard from '../components/GigCard';
import { getGigs } from '../../../services/gigApi';

export default function GigMarketplacePage() {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getGigs()
      .then((data) => {
        if (Array.isArray(data)) setGigs(data);
      })
      .catch(() => {
        setGigs([
          {
            id: 'GIG-702',
            title: 'Senior 3D Abstract Data Visualizer',
            freelancer: 'Elena Rostova',
            rate: '$85/hr',
            rating: '4.9 (124 reviews)',
            tags: ['Cinema4D', 'Data Art', 'Abstract'],
            description: 'Specializing in converting complex corporate reports and metric arrays into breathtaking 3D graphical art packages.'
          },
          {
            id: 'GIG-511',
            title: 'Brand Identity & Accessibility Designer',
            freelancer: 'Marcus Chen',
            rate: '$95/hr',
            rating: '5.0 (82 reviews)',
            tags: ['WCAG Guidelines', 'Typography', 'Figma'],
            description: 'Expert design layouts focused on modern typographic structures and comprehensive design system documentation.'
          }
        ]);
      });
  }, []);

  const filteredGigs = gigs.filter(gig => 
    (gig.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gig.freelancer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gig.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              placeholder="Search freelancers or tags..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>
        </div>

        {/* Multi-column grid catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredGigs.map((gig) => (
            <GigCard 
              key={gig.id} 
              gig={gig} 
              onSelect={(target) => navigate(`/gigs/${target.id}`)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
