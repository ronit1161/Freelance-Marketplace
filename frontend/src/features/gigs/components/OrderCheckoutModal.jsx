import { useState } from 'react';
import { X, ShieldCheck, Zap, Lock, CheckCircle2 } from 'lucide-react';
import { api } from '../../../services/api';

export default function OrderCheckoutModal({ gig, isOpen, onClose, onOrderSuccess }) {
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen || !gig) return null;

  // Extract base numerical rate
  const rateMatch = gig.rate ? gig.rate.match(/\d+/) : null;
  const basePrice = rateMatch ? parseInt(rateMatch[0], 10) : 150;
  const serviceFee = 5.00;
  const totalPrice = basePrice + serviceFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = api.createOrder({
        gigId: gig.id,
        gigTitle: gig.title,
        freelancerName: gig.freelancer,
        amount: totalPrice,
        brief,
        deliveryDays: 3
      });

      setIsSubmitting(false);
      setOrderComplete(true);

      setTimeout(() => {
        onOrderSuccess(createdOrder);
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ShieldCheck className="text-blue-600" size={22} />
            <span>Secure Order Checkout</span>
          </div>
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
              Your payment of <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span> has been safely placed in Escrow protection.
            </p>
            <p className="text-xs text-gray-400">Redirecting to your projects tracker...</p>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6">
            {/* Service Summary */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 items-start">
              <img 
                src={gig.avatar} 
                alt={gig.freelancer}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 text-sm truncate">{gig.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">By {gig.freelancer}</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-blue-600">
                  <span>Standard Package</span>
                  <span>•</span>
                  <span>⏱️ 3 Days Delivery</span>
                </div>
              </div>
            </div>

            {/* Brief Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Project Requirements & Instructions
              </label>
              <textarea 
                rows={3}
                required
                placeholder="Describe your specific expectations, design goals, and deliverables..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            {/* Financial Breakdown */}
            <div className="border-t border-b border-gray-100 py-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Service Package Price</span>
                <span className="font-semibold text-slate-900">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Escrow Processing Fee</span>
                <span className="font-semibold text-slate-900">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-dashed">
                <span>Total Due Now</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Escrow Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/80 p-3 rounded-xl border border-emerald-100">
              <Lock size={16} className="shrink-0" />
              <span>Funds remain locked in Escrow until you approve the final deliverable.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-slate-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Zap size={16} fill="currentColor" />
                    <span>Pay & Place Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
