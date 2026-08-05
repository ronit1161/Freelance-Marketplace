import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { createOrder as apiCreateOrder } from '../../../services/orderApi';
import { getWalletByUserId } from '../../../services/walletapi';
import { useAuth } from '../../../context/AuthContext';

export default function OrderCheckoutModal({ gig, isOpen, onClose, onOrderSuccess }) {
  const { user } = useAuth();
  const [brief, setBrief] = useState('');
  const [wallet, setWallet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id && isOpen) {
      getWalletByUserId(user.id)
        .then(setWallet)
        .catch(() => setWallet(null));
    }
  }, [user?.id, isOpen]);

  if (!isOpen || !gig) return null;

  const price = gig.price !== undefined ? gig.price : (gig.rate ? Number(gig.rate.replace(/[^0-9.]/g, '')) || 0 : 0);
  const freelancerName = gig.freelancerName || gig.freelancer || "Freelancer";
  const thumbnail = gig.thumbnailUrl || gig.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";
  const deliveryDays = gig.deliveryDays || 3;

  const availableBalance = wallet?.availableBalance ?? wallet?.balance ?? 0;
  const remainingBalance = availableBalance - Number(price);
  const hasInsufficientFunds = availableBalance < Number(price);

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

    if (hasInsufficientFunds) {
      setError('Insufficient wallet balance. Please top up your wallet before placing this order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const numericGigId = typeof gig.id === 'string' && gig.id.includes('-') ? 1 : Number(gig.id) || 1;
      const createdOrder = await apiCreateOrder({
        clientId: user.id,
        gigId: numericGigId,
        freelancerId: gig.freelancerId || gig.freelancer?.id || 1,
        requirements: brief.trim(),
        agreedPrice: price,
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
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
        
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
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
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
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Gig Info Display */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex gap-4 items-start">
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
                  <span>Turnaround: {deliveryDays} Days</span>
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

            {/* Financial Balance Summary */}
            <div className="border-t border-b border-gray-100 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1"><Wallet size={13} /> Current Wallet Balance</span>
                <span className="font-semibold text-slate-900">₹{Number(availableBalance).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Order Total (Escrow)</span>
                <span className="font-bold text-slate-900">₹{Number(price).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-dashed">
                <span>Remaining Balance</span>
                <span className={hasInsufficientFunds ? "text-red-600" : "text-emerald-600"}>
                  ₹{Number(remainingBalance).toFixed(2)}
                </span>
              </div>

              {hasInsufficientFunds && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium flex items-center justify-between mt-2">
                  <span>Insufficient funds. Top up your wallet to proceed.</span>
                  <Link to="/client/wallet" className="font-bold underline text-[#0058be]">Top Up</Link>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-slate-700 rounded-xl font-semibold hover:bg-gray-50 transition text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasInsufficientFunds}
                className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <span>Confirm & Place Order</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
