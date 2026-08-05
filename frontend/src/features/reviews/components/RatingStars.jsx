import React, { useState } from "react";
import { Star } from "lucide-react";

export default function RatingStars({
  rating = 5,
  maxRating = 5,
  size = 16,
  interactive = false,
  onChange,
  showLabel = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive ? hoverRating || rating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, idx) => {
          const starValue = idx + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={starValue}
              type={interactive ? "button" : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={interactive ? "p-0.5 transition transform hover:scale-110 focus:outline-none" : "p-0 cursor-default"}
            >
              <Star
                size={size}
                className={
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className="font-bold text-xs text-slate-800 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}
