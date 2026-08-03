import apiClient from "./apiClient";

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/api/categories");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch categories.";
    throw new Error(errorMessage);
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch category.";
    throw new Error(errorMessage);
  }
};

export const createCategory = async (categoryName) => {
  try {
    const response = await apiClient.post("/api/categories", { categoryName: categoryName.trim() });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create category.";
    throw new Error(errorMessage);
  }
};

export const updateCategory = async (id, categoryName) => {
  try {
    const response = await apiClient.put(`/api/categories/${id}`, { categoryName: categoryName.trim() });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update category.";
    throw new Error(errorMessage);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete category.";
    throw new Error(errorMessage);
  }
};
