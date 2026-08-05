import apiClient from "./apiClient";

export const getAllActiveGigs = async (categoryId = null, search = "") => {
  try {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;

    const response = await apiClient.get("/gigs", { params });
    const gigs = response.data.data || response.data || [];
    
    // Client side filtering fallback if backend returns all
    return gigs.filter((gig) => {
      let matchesCat = true;
      let matchesSearch = true;
      if (categoryId) {
        matchesCat = Number(gig.categoryId || gig.category?.id) === Number(categoryId);
      }
      if (search) {
        const query = search.toLowerCase();
        matchesSearch = (gig.title || "").toLowerCase().includes(query) || 
                        (gig.description || "").toLowerCase().includes(query);
      }
      return matchesCat && matchesSearch;
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gigs.";
    throw new Error(errorMessage);
  }
};

export const getGigById = async (id) => {
  try {
    const response = await apiClient.get(`/gigs/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch gig details.";
    throw new Error(errorMessage);
  }
};

export const createGig = async (gigData) => {
  try {
    const payload = {
      title: gigData.title,
      description: gigData.description,
      price: parseFloat(gigData.price),
      deliveryDays: parseInt(gigData.deliveryDays, 10),
      thumbnailUrl: gigData.thumbnailUrl || gigData.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      freelancerId: Number(gigData.freelancerId || gigData.userId),
      categoryId: Number(gigData.categoryId),
    };

    const response = await apiClient.post("/gigs", payload);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create gig.";
    throw new Error(errorMessage);
  }
};

export const updateGig = async (id, gigData) => {
  try {
    const payload = {
      title: gigData.title,
      description: gigData.description,
      price: parseFloat(gigData.price),
      deliveryDays: parseInt(gigData.deliveryDays, 10),
      thumbnailUrl: gigData.thumbnailUrl || gigData.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      freelancerId: Number(gigData.freelancerId || gigData.userId),
      categoryId: Number(gigData.categoryId),
    };

    const response = await apiClient.put(`/gigs/${id}`, payload);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update gig.";
    throw new Error(errorMessage);
  }
};

export const deleteGig = async (id) => {
  try {
    const response = await apiClient.delete(`/gigs/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete gig.";
    throw new Error(errorMessage);
  }
};

export const getGigsByFreelancer = async (freelancerId) => {
  try {
    const response = await apiClient.get(`/gigs/freelancer/${freelancerId}`);
    return response.data.data || response.data || [];
  } catch (error) {
    try {
      const allGigs = await getAllActiveGigs();
      return allGigs.filter(
        (gig) => Number(gig.freelancerId || gig.freelancer?.id) === Number(freelancerId)
      );
    } catch (e) {
      return [];
    }
  }
};
