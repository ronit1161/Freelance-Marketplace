import apiClient from "./apiClient";

export const getAllActiveGigs = async (categoryId = null, search = "", sortBy = null) => {
  try {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;

    const response = await apiClient.get("/gigs", { params });
    const gigs = response.data?.data || response.data || [];
    return gigs;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gigs.";
    throw new Error(errorMessage);
  }
};

export const getGigById = async (id) => {
  try {
    const response = await apiClient.get(`/gigs/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gig details.";
    throw new Error(errorMessage);
  }
};

export const getMyGigs = async () => {
  try {
    const response = await apiClient.get("/gigs/my");
    return response.data?.data || response.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch your gigs.";
    throw new Error(errorMessage);
  }
};

export const getGigsByFreelancer = async (freelancerId) => {
  try {
    const response = await apiClient.get(`/gigs/freelancer/${freelancerId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer gigs.";
    throw new Error(errorMessage);
  }
};

export const createGig = async (gigData) => {
  try {
    const payload = {
      title: (gigData.title || "").trim(),
      description: (gigData.description || "").trim(),
      price: parseFloat(gigData.price),
      deliveryDays: parseInt(gigData.deliveryDays, 10),
      thumbnailUrl: (gigData.thumbnailUrl || gigData.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3").trim(),
      categoryId: Number(gigData.categoryId),
    };

    const response = await apiClient.post("/gigs", payload);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create gig.";
    throw new Error(errorMessage);
  }
};

export const updateGig = async (id, gigData) => {
  try {
    const payload = {
      title: (gigData.title || "").trim(),
      description: (gigData.description || "").trim(),
      price: parseFloat(gigData.price),
      deliveryDays: parseInt(gigData.deliveryDays, 10),
      thumbnailUrl: (gigData.thumbnailUrl || gigData.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3").trim(),
      categoryId: Number(gigData.categoryId),
    };

    const response = await apiClient.put(`/gigs/${id}`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update gig.";
    throw new Error(errorMessage);
  }
};

export const deleteGig = async (id) => {
  try {
    const response = await apiClient.delete(`/gigs/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete gig.";
    throw new Error(errorMessage);
  }
};
