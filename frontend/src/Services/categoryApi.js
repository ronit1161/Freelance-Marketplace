import apiClient from "./apiClient";

export const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await apiClient.post("/categories", categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await apiClient.delete(`/categories/${categoryId}`);
  return response.data;
};
