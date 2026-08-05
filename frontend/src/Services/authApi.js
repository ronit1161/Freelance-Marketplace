import apiClient from "./apiClient";

export const loginUser = async ({ email, userNameOrEmail, password }) => {
  const loginIdentifier = (email || userNameOrEmail || "").trim();
  const response = await apiClient.post("/auth/login", {
    email: loginIdentifier,
    password,
  });
  return response.data;
};

export const registerUser = async (formData) => {
  const userName = formData.userName || (formData.email ? formData.email.split("@")[0] : "");
  const fullNameValue = (formData.fullName || formData.name || userName).trim();
  const payload = {
    userName: userName.trim(),
    email: (formData.email || "").trim().toLowerCase(),
    password: formData.password,
    name: fullNameValue,
    fullName: fullNameValue,
    role: (formData.role || "CLIENT").toUpperCase(),
  };

  const response = await apiClient.post("/auth/register", payload);
  return response.data;
};

