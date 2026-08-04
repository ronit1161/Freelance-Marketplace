import apiClient from "./apiClient";

export const getWalletByUserId = async (userId) => {
  try {
    const response = await apiClient.get("/wallet", {
      params: { userId },
    });
    return response.data.data || response.data;
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
    const response = await apiClient.post("/wallet/add", {
      userId,
      amount: parseFloat(amount),
    });
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to add money to wallet.";
    throw new Error(errorMessage);
  }
};

export const addMoneyToWallet = async (userId, amount) => {
  return await topUpWallet({ userId, amount });
};

export const getWalletTransactions = async (userId) => {
  try {
    const response = await apiClient.get("/wallet/transactions", {
      params: { userId },
    });
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch transactions.";
    throw new Error(errorMessage);
  }
};

export const getAllWallets = async () => {
  try {
    const response = await apiClient.get("/wallet");
    return response.data.data || response.data;
  } catch (error) {
    return [];
  }
};