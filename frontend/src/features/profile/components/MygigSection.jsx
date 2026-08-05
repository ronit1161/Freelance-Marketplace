import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getGigsByFreelancer } from '../../../services/gigApi';
import GigCard from '../../gigs/components/GigCard';
import { Link } from 'react-router-dom';
import { PlusCircle, ShoppingBag } from 'lucide-react';

const MygigSection = () => {
    const { user } = useAuth();
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            getGigsByFreelancer(user.id)
                .then(data => setGigs(data || []))
                .catch(err => console.error("Failed to load freelancer gigs", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    return (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">
                    My Published Gigs
                </h2>
                <Link
                    to="/freelancer/create-gig"
                    className="text-xs font-bold text-[#0058be] hover:underline inline-flex items-center gap-1"
                >
                    <PlusCircle size={14} /> Post New Gig
                </Link>
            </div>

            {loading && <div className="text-center py-6 text-slate-500 text-sm">Loading your Gigs...</div>}

            {!loading && gigs.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 space-y-2">
                    <ShoppingBag size={24} className="mx-auto text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">No Gigs Published Yet</p>
                    <p className="text-xs text-slate-500">Create your first marketplace offering to start earning.</p>
                </div>
            )}

            {!loading && gigs.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map(g => (
                        <GigCard
                            key={g.id}
                            gig={{
                                id: g.id,
                                title: g.title,
                                freelancer: g.freelancerName || user?.fullName || "Freelancer",
                                rate: `₹${g.price}`,
                                rating: "5.0",
                                tags: [g.categoryName || "Service"],
                                description: g.description,
                                avatar: g.thumbnailUrl || user?.profileAvatarURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MygigSection;