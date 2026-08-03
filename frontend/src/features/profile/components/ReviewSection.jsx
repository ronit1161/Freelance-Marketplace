import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getReviewsForFreelancer } from '../../../services/reviewApi';
import { Star, MessageSquare } from 'lucide-react';

const ReviewSection = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            getReviewsForFreelancer(user.id)
                .then(data => setReviews(data || []))
                .catch(err => console.error("Failed to load reviews", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    return (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4">
                Client Reviews & Feedback
            </h2>

            {loading && <div className="text-center py-6 text-slate-500 text-sm">Loading reviews...</div>}

            {!loading && reviews.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 space-y-2">
                    <MessageSquare size={24} className="mx-auto text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">No Client Reviews Yet</p>
                    <p className="text-xs text-slate-500">Completed client orders will feature client ratings & feedback here.</p>
                </div>
            )}

            {!loading && reviews.length > 0 && (
                <div className="space-y-4 divide-y divide-gray-100">
                    {reviews.map(rev => (
                        <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-slate-900 text-sm">
                                    {rev.clientName || "Client Reviewer"}
                                </h4>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                    <Star size={14} fill="currentColor" />
                                    <span>{rev.rating}.0</span>
                                </div>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                                {rev.comment || "Great work!"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ReviewSection;