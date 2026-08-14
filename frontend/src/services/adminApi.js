import apiClient from "./apiClient";
import { getAllCategories } from "./categoryApi";
import { getAllActiveGigs } from "./gigApi";
import { getAllOrders } from "./orderApi";
import { getAllUsers } from "./userApi";

export const getDashboardStats = async () => {
  try {
    const [categories, gigs, orders, users] = await Promise.all([
      getAllCategories().catch(() => []),
      getAllActiveGigs().catch(() => []),
      getAllOrders().catch(() => []),
      getAllUsers().catch(() => []),
    ]);

    const totalOrders = orders.length;
    const totalClients = users.filter((u) => u.role?.toUpperCase() === "CLIENT").length;
    const totalFreelancers = users.filter((u) => u.role?.toUpperCase() === "FREELANCER").length;
    const totalUsers = users.length;
    const totalRevenue = orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + (Number(o.agreedPrice) || 0), 0);

    return {
      totalUsers: totalUsers || 0,
      totalClients: totalClients || 0,
      totalFreelancers: totalFreelancers || 0,
      totalGigs: gigs.length || 0,
      totalCategories: categories.length || 0,
      totalOrders: totalOrders || 0,
      totalRevenue: totalRevenue || 0,
    };
  } catch (error) {
    return {
      totalUsers: 0,
      totalClients: 0,
      totalFreelancers: 0,
      totalGigs: 0,
      totalCategories: 0,
      totalOrders: 0,
      totalRevenue: 0,
    };
  }
};

export { getAllUsers };

export const deleteGigByAdmin = async (gigId) => {
  try {
    const response = await apiClient.delete(`/gigs/${gigId}`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete gig.";
    throw new Error(errorMessage);
  }
};

export const deleteOrderByAdmin = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to cancel order.";
    throw new Error(errorMessage);
  }
};

export const getAllReviews = async () => {
  try {
    const response = await apiClient.get("/reviews");
    return response.data?.data || response.data || [];
  } catch (error) {
    return [];
  }
};

export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete review.";
    throw new Error(errorMessage);
  }
};

export const deleteReview = deleteReviewByAdmin;

export const getAllTransactions = async () => {
  try {
    const response = await apiClient.get("/wallet/transactions");
    return response.data?.data || response.data || [];
  } catch (error) {
    return [];
  }
};
