import apiClient from "./apiClient";

export const loginUser = async ({ email, userNameOrEmail, identifier, password }) => {
  const loginIdentifier = (identifier || email || userNameOrEmail || "").trim();
  const response = await apiClient.post("/auth/login", {
    identifier: loginIdentifier,
    email: loginIdentifier,
    password,
  });
  return response.data?.data || response.data;
};

export const registerUser = async (formData) => {
  const userName = (formData.username || formData.userName || (formData.email ? formData.email.split("@")[0] : "")).trim();
  const emailValue = (formData.email || "").trim().toLowerCase();
  const roleRaw = (formData.role || "CLIENT").toUpperCase();
  const roleValue = roleRaw.startsWith("ROLE_") ? roleRaw : `ROLE_${roleRaw}`;

  const payload = {
    username: userName,
    email: emailValue,
    password: formData.password,
    role: roleValue,
  };

  const response = await apiClient.post("/auth/register", payload);
  return response.data?.data || response.data;
};

export const getCurrentAuthUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data?.data || response.data;
};
