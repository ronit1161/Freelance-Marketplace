import apiClient from "./apiClient";

export const createReview = async ({ clientId, orderId, rating, comment }) => {
  try {
    const response = await apiClient.post("/api/reviews", {
      clientId,
      orderId,
      rating: parseInt(rating, 10),
      comment: comment ? comment.trim() : "",
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to submit review.";
    throw new Error(errorMessage);
  }
};

export const getReviewsForFreelancer = async (freelancerId) => {
  try {
    const response = await apiClient.get(`/api/reviews/freelancer/${freelancerId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer reviews.";
    throw new Error(errorMessage);
  }
};

export const getReviewByOrderId = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/reviews/order/${orderId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch order review.";
    throw new Error(errorMessage);
  }
};

export const getAllReviews = async () => {
  try {
    const response = await apiClient.get("/api/reviews");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch reviews.";
    throw new Error(errorMessage);
  }
};

export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete review.";
    throw new Error(errorMessage);
  }
};

export const deleteReview = deleteReviewByAdmin;
