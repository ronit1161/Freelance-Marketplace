import apiClient from "./apiClient";

/**
 * Fetch all notifications for the currently logged-in user.
 * JWT token is automatically passed via apiClient interceptor,
 * and API Gateway injects X-User-Id downstream.
 */
export const getMyNotifications = async () => {
  try {
    const response = await apiClient.get("/notifications");
    return response.data?.data || response.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch notifications.";
    throw new Error(errorMessage);
  }
};

/**
 * Mark a specific notification as read.
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to mark notification as read.";
    throw new Error(errorMessage);
  }
};
