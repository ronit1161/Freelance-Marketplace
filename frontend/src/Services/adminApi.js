import apiClient from "./apiClient";

export const getAdminUsers = async () => {
  const response = await apiClient.get("/api/admin/users");
  return response.data;
};

export const getAdminUserById = async (userId) => {
  const response = await apiClient.get(`/api/admin/users/${userId}`);
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await apiClient.put(`/api/admin/users/${userId}/block`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await apiClient.put(`/api/admin/users/${userId}/unblock`);
  return response.data;
};

export const getAdminGigs = async () => {
  const response = await apiClient.get("/api/admin/gigs");
  return response.data;
};

export const deleteGigByAdmin = async (gigId) => {
  const response = await apiClient.delete(`/api/admin/gigs/${gigId}`);
  return response.data;
};

export const getAdminCategories = async () => {
  const response = await apiClient.get("/api/admin/categories");
  return response.data;
};

export const createAdminCategory = async (categoryData) => {
  const response = await apiClient.post("/api/admin/categories", categoryData);
  return response.data;
};

export const deleteAdminCategory = async (categoryId) => {
  const response = await apiClient.delete(`/categories/${categoryId}`);
  return response.data;
};

export const getRevenueGraph = async () => {
  const response = await apiClient.get("/api/admin/dashboard/revenue");
  return response.data;
};

