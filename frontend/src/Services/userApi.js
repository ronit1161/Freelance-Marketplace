import apiClient from "./apiClient";

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user profile.";
    throw new Error(errorMessage);
  }
};

export const updateUserProfile = async (id, updateDTO) => {
  try {
    const payload = {
      fullName: updateDTO.fullName || updateDTO.name || "",
      profileAvatarURL: updateDTO.profileAvatarURL || updateDTO.avatar || "",
      bioData: updateDTO.bioData || updateDTO.bio || "",
      skills: updateDTO.skills || "",
      experience: updateDTO.experience ? parseInt(updateDTO.experience, 10) : 0,
      email: updateDTO.email || "",
      userName: updateDTO.userName || "",
    };

    // Try dedicated profile update endpoint first
    try {
      const response = await apiClient.put(`/users/${id}/profile`, payload);
      return response.data.data || response.data;
    } catch (err) {
      // Fallback to /users/{id}
      const response = await apiClient.put(`/users/${id}`, payload);
      return response.data.data || response.data;
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      "Failed to update user profile.";
    throw new Error(errorMessage);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data.data || response.data;
  } catch (error) {
    try {
      const response = await apiClient.get("/users");
      return response.data.data || response.data;
    } catch (e) {
      return [];
    }
  }
};

export const toggleBlockUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to toggle block status.";
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete user.";
    throw new Error(errorMessage);
  }
};
