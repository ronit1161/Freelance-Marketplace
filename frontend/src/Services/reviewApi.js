import apiClient from "./apiClient";

export const createReview = async (reviewData) => {
  const response = await apiClient.post("/reviews", reviewData);
  return response.data;
};

export const getGigReviews = async (gigId) => {
  const response = await apiClient.get(`/reviews/${gigId}`);
  return response.data;
};
