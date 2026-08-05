import apiClient from "./apiClient";

export const createReview = async ({ clientId, freelancerId, orderId, rating, comment }) => {
  try {
    const response = await apiClient.post("/reviews", {
      clientId: Number(clientId),
      freelancerId: Number(freelancerId || 1),
      orderId: Number(orderId),
      rating: parseInt(rating, 10),
      comment: comment ? comment.trim() : "",
    });
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to submit review.";
    throw new Error(errorMessage);
  }
};

export const getReviewsForFreelancer = async (freelancerId) => {
  try {
    const response = await apiClient.get(`/reviews/freelancer/${freelancerId}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer reviews.";
    throw new Error(errorMessage);
  }
};

export const getReviewsForGig = async (gigId) => {
  try {
    const response = await apiClient.get(`/reviews/gig/${gigId}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gig reviews.";
    throw new Error(errorMessage);
  }
};

export const getReviewsForClient = async (clientId) => {
  try {
    const response = await apiClient.get(`/reviews/client/${clientId}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch client reviews.";
    throw new Error(errorMessage);
  }
};

export const getAllReviews = async () => {
  try {
    const response = await apiClient.get("/reviews");
    return response.data.data || response.data;
  } catch (error) {
    return [];
  }
};

export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete review.";
    throw new Error(errorMessage);
  }
};

export const deleteReview = deleteReviewByAdmin;
