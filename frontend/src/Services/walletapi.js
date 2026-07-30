import apiClient from "./apiClient";

export const getWallet = async () => {
  const response = await apiClient.get("/wallet");
  return response.data;
};

export const getWalletTransactions = async () => {
  const response = await apiClient.get("/wallet/transactions");
  return response.data;
};

export const addMoneyToWallet = async (userId, amount) => {
  const response = await apiClient.post("/wallet/add", { userId, amount });
  return response.data;
};

