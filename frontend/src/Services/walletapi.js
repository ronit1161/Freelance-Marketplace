import apiClient from "./apiClient";

export const getWalletByUserId = async (userId = null) => {
  try {
    const endpoint = userId ? `/wallet/${userId}` : "/wallet";
    const response = await apiClient.get(endpoint);
    const data = response.data?.data || response.data;
    return {
      ...data,
      balance: data?.availableBalance !== undefined ? data.availableBalance : (data?.balance || 0),
      heldBalance: data?.escrowBalance !== undefined ? data.escrowBalance : (data?.heldBalance || 0),
      availableBalance: data?.availableBalance !== undefined ? data.availableBalance : 0,
      escrowBalance: data?.escrowBalance !== undefined ? data.escrowBalance : 0,
      totalBalance: data?.totalBalance !== undefined ? data.totalBalance : 0,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch wallet details.";
    throw new Error(errorMessage);
  }
};

export const getClientWallet = async (userId = null) => {
  return await getWalletByUserId(userId);
};

export const topUpWallet = async ({ amount, userId }) => {
  try {
    const response = await apiClient.post("/wallet/deposit", {
      amount: parseFloat(amount),
    });
    const data = response.data?.data || response.data;
    return {
      ...data,
      balance: data?.availableBalance !== undefined ? data.availableBalance : (data?.balance || 0),
      heldBalance: data?.escrowBalance !== undefined ? data.escrowBalance : (data?.heldBalance || 0),
      availableBalance: data?.availableBalance !== undefined ? data.availableBalance : 0,
      escrowBalance: data?.escrowBalance !== undefined ? data.escrowBalance : 0,
      totalBalance: data?.totalBalance !== undefined ? data.totalBalance : 0,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to add money to wallet.";
    throw new Error(errorMessage);
  }
};

export const addMoneyToWallet = async (userId, amount) => {
  return await topUpWallet({ userId, amount });
};

export const getWalletTransactions = async (userId = null) => {
  try {
    const response = await apiClient.get("/wallet/transactions");
    const list = response.data?.data || response.data || [];
    return list.map((tx) => ({
      ...tx,
      transactionType: tx.transactionType || "DEPOSIT",
      transactionStatus: "COMPLETED",
      description: tx.description || "",
      createdOn: tx.createdAt,
    }));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch transactions.";
    throw new Error(errorMessage);
  }
};

export const getAllWallets = async () => {
  try {
    const response = await apiClient.get("/wallet");
    return response.data?.data || response.data;
  } catch (error) {
    return null;
  }
};