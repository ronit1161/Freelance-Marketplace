import { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { createOrder as apiCreateOrder } from '../../../services/orderApi';
import { useAuth } from '../../../context/AuthContext';

export default function OrderCheckoutModal({ gig, isOpen, onClose, onOrderSuccess }) {
  const { user } = useAuth();
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !gig) return null;

  const price = gig.price !== undefined ? gig.price : (gig.rate ? Number(gig.rate.replace(/[^0-9.]/g, '')) || 0 : 0);
  const freelancerName = gig.freelancerName || gig.freelancer || "Freelancer";
  const thumbnail = gig.thumbnailUrl || gig.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";
  const deliveryDays = gig.deliveryDays || 3;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user.id) {
      setError('Please log in as a client to place an order.');
      return;
    }

    if (!brief.trim()) {
      setError('Project requirements are mandatory.');
      return;
    }

    setIsSubmitting(true);

    try {
      const numericGigId = typeof gig.id === 'string' && gig.id.includes('-') ? 1 : Number(gig.id) || 1;
      const createdOrder = await apiCreateOrder({
        clientId: user.id,
        gigId: numericGigId,
        requirements: brief.trim(),
      });

      setIsSubmitting(false);
      setOrderComplete(true);

      setTimeout(() => {
        onOrderSuccess(createdOrder);
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to place order. Please check your wallet balance.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-slate-900 font-bold text-lg">
            Place Order
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {orderComplete ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-sm text-slate-600">
              Total Order Amount: <span className="font-bold text-slate-900">₹{Number(price).toFixed(2)}</span>
            </p>
            <p className="text-xs text-gray-400">Redirecting to your orders tracker...</p>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Gig Info Display */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 items-start">
              <img 
                src={thumbnail} 
                alt={gig.title}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{gig.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">By {freelancerName}</p>
                <div className="mt-2 text-xs font-semibold text-slate-700">
                  <span>Delivery: {deliveryDays} Days</span>
                </div>
              </div>
            </div>

            {/* Requirements Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Project Requirements & Instructions <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={3}
                required
                placeholder="Describe your specific project expectations, instructions, and deliverables..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-b border-gray-100 py-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Service Price</span>
                <span className="font-semibold text-slate-900">₹{Number(price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-dashed">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{Number(price).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-slate-700 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <span>Place Order</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
