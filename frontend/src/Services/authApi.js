import apiClient from "./apiClient";

export const loginUser = async ({ userNameOrEmail, password }) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      userNameOrEmail: userNameOrEmail.trim(),
      password,
    });
    return response.data.data; // returns { token, message, user }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
    throw new Error(errorMessage);
  }
};

export const registerUser = async (formData) => {
  try {
    const userName = formData.userName || formData.email.split("@")[0];
    const payload = {
      userName: userName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      fullName: (formData.fullName || formData.name || userName).trim(),
      role: (formData.role || "CLIENT").toUpperCase(),
    };

    const response = await apiClient.post("/api/users/register", payload);
    return response.data.data; // returns registered User object
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
    throw new Error(errorMessage);
  }
};
