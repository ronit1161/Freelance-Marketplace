import { useState, useEffect, useCallback } from "react";
import {
  getReviewsForFreelancer,
  getReviewsForGig,
  getReviewsForClient,
  createReview,
} from "../../../services/reviewApi";

export function useReviews({ userId, gigId, role = "CLIENT" } = {}) {
  const [reviews, setReviews] = useState([]);
  const [clientReviewsMap, setClientReviewsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (gigId) {
        data = await getReviewsForGig(gigId);
      } else if (userId && role.toUpperCase() === "CLIENT") {
        data = await getReviewsForClient(userId);
      } else if (userId && role.toUpperCase() === "FREELANCER") {
        data = await getReviewsForFreelancer(userId);
      }

      setReviews(data || []);

      // Build map of orderId -> review object
      const map = {};
      (data || []).forEach((rev) => {
        if (rev.orderId) {
          map[rev.orderId] = rev;
        }
      });
      setClientReviewsMap(map);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError(err?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [userId, gigId, role]);

  useEffect(() => {
    if (userId || gigId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [userId, gigId, role, fetchReviews]);

  const submitReview = async ({ clientId, freelancerId, orderId, rating, comment }) => {
    const newReview = await createReview({
      clientId,
      freelancerId,
      orderId,
      rating,
      comment,
    });
    await fetchReviews();
    return newReview;
  };

  return {
    reviews,
    clientReviewsMap,
    loading,
    error,
    refreshReviews: fetchReviews,
    submitReview,
  };
}
