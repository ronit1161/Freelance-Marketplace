import apiClient from "./apiClient";

export const getAdminUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};

export const deleteGigByAdmin = async (gigId) => {
  const response = await apiClient.delete(`/gigs/${gigId}`);
  return response.data;
};
