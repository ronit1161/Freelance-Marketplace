import apiClient from "./apiClient";

export const getAllActiveGigs = async (categoryId = null, search = "") => {
  try {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;

    const response = await apiClient.get("/api/gigs", { params });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gigs.";
    throw new Error(errorMessage);
  }
};

export const getGigById = async (id) => {
  try {
    const response = await apiClient.get(`/api/gigs/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gig details.";
    throw new Error(errorMessage);
  }
};

export const createGig = async (gigData) => {
  try {
    const response = await apiClient.post("/api/gigs", gigData);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create gig.";
    throw new Error(errorMessage);
  }
};

export const updateGig = async (id, gigData) => {
  try {
    const response = await apiClient.put(`/api/gigs/${id}`, gigData);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update gig.";
    throw new Error(errorMessage);
  }
};

export const deleteGig = async (id) => {
  try {
    const response = await apiClient.delete(`/api/gigs/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete gig.";
    throw new Error(errorMessage);
  }
};

export const getGigsByFreelancer = async (freelancerId) => {
  try {
    const response = await apiClient.get(`/api/gigs/freelancer/${freelancerId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer gigs.";
    throw new Error(errorMessage);
  }
};
