import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard");
    const data = response.data.data || response.data;
    return {
      totalUsers: data.totalUsers || 0,
      totalGigs: data.totalGigs || 0,
      totalOrders: data.totalOrders || 0,
      totalRevenue: data.totalRevenue || 0,
    };
  } catch (error) {
    return {
      totalUsers: 0,
      totalGigs: 0,
      totalOrders: 0,
      totalRevenue: 0,
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};

export const deleteGigByAdmin = async (gigId) => {
  try {
    const response = await apiClient.delete(`/admin/gigs/${gigId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete gig.";
    throw new Error(errorMessage);
  }
};

export const deleteOrderByAdmin = async (orderId) => {
  try {
    const response = await apiClient.delete(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete order.";
    throw new Error(errorMessage);
  }
};

export const getAllReviews = async () => {
  try {
    const response = await apiClient.get("/admin/reviews");
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};

export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete review.";
    throw new Error(errorMessage);
  }
};

export const deleteReview = deleteReviewByAdmin;

export const getAllTransactions = async () => {
  try {
    const response = await apiClient.get("/admin/wallet-transactions");
    return response.data.data?.content || response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};
