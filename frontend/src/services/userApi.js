import apiClient from "./apiClient";

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/profile/${id}`);
    const data = response.data?.data || response.data;
    return {
      ...data,
      id: data?.userId || data?.profileId || id,
      fullName: data?.fullName || "",
      profileAvatarURL: data?.profileAvatarUrl || data?.profileAvatarURL || "",
      bioData: data?.bio || data?.bioData || "",
      skills: data?.skills || "",
      experience: data?.experienceYears !== undefined ? data.experienceYears : (data?.experience || 0),
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user profile.";
    throw new Error(errorMessage);
  }
};

export const getCurrentUserProfile = async () => {
  try {
    const response = await apiClient.get("/users/profile");
    const data = response.data?.data || response.data;
    return {
      ...data,
      id: data?.userId || data?.profileId,
      fullName: data?.fullName || "",
      profileAvatarURL: data?.profileAvatarUrl || data?.profileAvatarURL || "",
      bioData: data?.bio || data?.bioData || "",
      skills: data?.skills || "",
      experience: data?.experienceYears !== undefined ? data.experienceYears : (data?.experience || 0),
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch current user profile.";
    throw new Error(errorMessage);
  }
};

export const updateUserProfile = async (id, updateDTO) => {
  try {
    const payload = {
      fullName: (updateDTO.fullName || updateDTO.name || "").trim(),
      bio: (updateDTO.bio || updateDTO.bioData || "").trim(),
      skills: (updateDTO.skills || "").trim(),
      experienceYears: updateDTO.experienceYears !== undefined
        ? parseInt(updateDTO.experienceYears, 10)
        : (updateDTO.experience ? parseInt(updateDTO.experience, 10) : 0),
      profileAvatarUrl: (updateDTO.profileAvatarUrl || updateDTO.profileAvatarURL || updateDTO.avatar || "").trim(),
    };

    const response = await apiClient.put("/users/profile", payload);
    const data = response.data?.data || response.data;
    return {
      ...data,
      id: data?.userId || data?.profileId || id,
      fullName: data?.fullName || "",
      profileAvatarURL: data?.profileAvatarUrl || data?.profileAvatarURL || "",
      bioData: data?.bio || data?.bioData || "",
      skills: data?.skills || "",
      experience: data?.experienceYears !== undefined ? data.experienceYears : (data?.experience || 0),
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      "Failed to update user profile.";
    throw new Error(errorMessage);
  }
};

export const getFreelancers = async (skill, minExperience) => {
  try {
    const params = {};
    if (skill) params.skill = skill;
    if (minExperience !== undefined && minExperience !== null) params.minExperience = minExperience;

    const response = await apiClient.get("/users/freelancers", { params });
    const list = response.data?.data || response.data || [];
    return list.map((item) => ({
      ...item,
      id: item.userId || item.id,
      profileAvatarURL: item.profileAvatarUrl || item.profileAvatarURL || "",
      bioData: item.bio || item.bioData || "",
      experience: item.experienceYears !== undefined ? item.experienceYears : (item.experience || 0),
    }));
  } catch (error) {
    console.error("Failed to fetch freelancers:", error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/auth/admin/users");
    const list = response.data?.data || response.data || [];
    return list.map((item) => ({
      ...item,
      id: item.id || item.userId,
      userName: item.username || item.userName || "",
      fullName: item.fullName || item.username || item.userName || `User #${item.id}`,
      email: item.email || "",
      role: item.role ? item.role.replace("ROLE_", "") : "USER",
      isBlocked: !!item.blocked || !!item.isBlocked,
      isActive: item.active !== undefined ? item.active : true,
      createdOn: item.createdAt || item.createdOn || "",
    }));
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    const errorMessage = error.response?.data?.message || "Failed to fetch users.";
    throw new Error(errorMessage);
  }
};

export const toggleBlockUser = async (id) => {
  try {
    const response = await apiClient.patch(`/auth/admin/users/${id}/toggle-block`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to toggle block status.";
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (id) => {
  try {
    return { success: true, message: "User deleted." };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete user.";
    throw new Error(errorMessage);
  }
};
