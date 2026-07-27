import { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, onSubmitReview, projectTitle }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitReview({ rating, comment });
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Review Submitted!</h3>
            <p className="text-xs text-gray-500">Thank you for helping maintain high quality in our marketplace community.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Order Complete</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Rate Your Experience</h3>
              <p className="text-xs text-gray-500 mt-1">Leave feedback for "{projectTitle || 'Editorial Service'}"</p>
            </div>

            {/* Star Rating Select */}
            <div className="flex justify-center items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                  />
                </button>
              ))}
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Detailed Feedback</label>
              <textarea
                rows={3}
                required
                placeholder="Describe communication, quality of work, and delivery timeliness..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-semibold transition shadow-sm"
            >
              Submit Public Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
