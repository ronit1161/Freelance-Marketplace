import apiClient from "./apiClient";

export const getWalletByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/api/wallets/user/${userId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch wallet details.";
    throw new Error(errorMessage);
  }
};

export const getClientWallet = async (userId) => {
  return await getWalletByUserId(userId);
};

export const topUpWallet = async ({ userId, amount }) => {
  try {
    const response = await apiClient.post("/api/wallets/top-up", {
      userId,
      amount: parseFloat(amount),
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to add virtual coins.";
    throw new Error(errorMessage);
  }
};

export const addMoneyToWallet = async (userId, amount) => {
  return await topUpWallet({ userId, amount });
};

export const getAllWallets = async () => {
  try {
    const response = await apiClient.get("/api/wallets");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch wallets.";
    throw new Error(errorMessage);
  }
};