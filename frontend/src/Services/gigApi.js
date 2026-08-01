import apiClient from "./apiClient";

export const getGigs = async (params = {}) => {
  const response = await apiClient.get("/gigs", { params });
  return response.data;
};

export const getGigById = async (gigId) => {
  const response = await apiClient.get(`/gigs/${gigId}`);
  return response.data;
};

export const createGig = async (gigData) => {
  const response = await apiClient.post("/gigs", gigData);
  return response.data;
};

export const updateGig = async (gigId, gigData) => {
  const response = await apiClient.put(`/gigs/${gigId}`, gigData);
  return response.data;
};

export const deleteGig = async (gigId) => {
  const response = await apiClient.delete(`/gigs/${gigId}`);
  return response.data;
};
