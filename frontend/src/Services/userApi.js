import apiClient from "./apiClient";

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user profile.";
    throw new Error(errorMessage);
  }
};

export const updateUserProfile = async (id, updateDTO) => {
  try {
    const payload = {
      fullName: updateDTO.fullName,
      profileAvatarURL: updateDTO.profileAvatarURL,
      bioData: updateDTO.bioData,
      skills: updateDTO.skills,
      experience: updateDTO.experience ? parseInt(updateDTO.experience, 10) : 0,
    };
    const response = await apiClient.put(`/api/users/${id}`, payload);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update user profile.";
    throw new Error(errorMessage);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/api/users");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch users.";
    throw new Error(errorMessage);
  }
};

export const toggleBlockUser = async (id) => {
  try {
    const response = await apiClient.patch(`/api/users/${id}/block`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to toggle block status.";
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete user.";
    throw new Error(errorMessage);
  }
};
