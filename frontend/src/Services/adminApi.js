import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/api/admin/dashboard/stats");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch admin dashboard stats.";
    throw new Error(errorMessage);
  }
};

export const deleteGigByAdmin = async (gigId) => {
  try {
    const response = await apiClient.delete(`/api/admin/gigs/${gigId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete gig.";
    throw new Error(errorMessage);
  }
};

export const deleteOrderByAdmin = async (orderId) => {
  try {
    const response = await apiClient.delete(`/api/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete order.";
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

export const getAllTransactions = async () => {
  try {
    const response = await apiClient.get("/api/transactions");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch transactions.";
    throw new Error(errorMessage);
  }
};
