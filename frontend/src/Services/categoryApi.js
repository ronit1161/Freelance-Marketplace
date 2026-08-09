import apiClient from "./apiClient";

export const normalizeCategory = (cat) => {
  if (!cat) return null;
  const name = cat.name || cat.categoryName || "";
  return {
    ...cat,
    id: cat.id,
    name: name,
    categoryName: name,
    description: cat.description || "",
    active: cat.active !== undefined ? cat.active : true,
  };
};

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeCategory) : [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch categories.";
    throw new Error(errorMessage);
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/categories/${id}`);
    const data = response.data?.data || response.data;
    return normalizeCategory(data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch category.";
    throw new Error(errorMessage);
  }
};

export const createCategory = async (categoryName, description = "") => {
  try {
    const nameValue = typeof categoryName === "object" ? (categoryName.name || categoryName.categoryName) : categoryName;
    const descValue = typeof categoryName === "object" ? categoryName.description : description;

    const response = await apiClient.post("/categories", {
      name: (nameValue || "").trim(),
      description: (descValue || "").trim(),
    });
    const data = response.data?.data || response.data;
    return normalizeCategory(data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create category.";
    throw new Error(errorMessage);
  }
};

export const updateCategory = async (id, categoryName, description = "") => {
  try {
    const nameValue = typeof categoryName === "object" ? (categoryName.name || categoryName.categoryName) : categoryName;
    const descValue = typeof categoryName === "object" ? categoryName.description : description;

    const response = await apiClient.put(`/categories/${id}`, {
      name: (nameValue || "").trim(),
      description: (descValue || "").trim(),
    });
    const data = response.data?.data || response.data;
    return normalizeCategory(data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update category.";
    throw new Error(errorMessage);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete category.";
    throw new Error(errorMessage);
  }
};
