import apiClient from "./apiClient";

export const createOrder = async ({ clientId, gigId, requirements }) => {
  try {
    const response = await apiClient.post("/api/orders", {
      clientId,
      gigId,
      requirements,
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to place order. Check wallet balance.";
    throw new Error(errorMessage);
  }
};

export const acceptOrder = async (orderId, freelancerId) => {
  try {
    const response = await apiClient.patch(`/api/orders/${orderId}/accept`, null, {
      params: { freelancerId },
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to accept order.";
    throw new Error(errorMessage);
  }
};

export const startOrder = async (orderId, freelancerId) => {
  try {
    const response = await apiClient.patch(`/api/orders/${orderId}/start`, null, {
      params: { freelancerId },
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to start order.";
    throw new Error(errorMessage);
  }
};

export const completeOrder = async (orderId, freelancerId) => {
  try {
    const response = await apiClient.patch(`/api/orders/${orderId}/complete`, null, {
      params: { freelancerId },
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to complete order.";
    throw new Error(errorMessage);
  }
};

export const cancelOrder = async (orderId, userId) => {
  try {
    const response = await apiClient.patch(`/api/orders/${orderId}/cancel`, null, {
      params: { userId },
    });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to cancel order.";
    throw new Error(errorMessage);
  }
};

export const getClientOrders = async (clientId) => {
  try {
    const response = await apiClient.get(`/api/orders/client/${clientId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch client orders.";
    throw new Error(errorMessage);
  }
};

export const getFreelancerOrders = async (freelancerId) => {
  try {
    const response = await apiClient.get(`/api/orders/freelancer/${freelancerId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer orders.";
    throw new Error(errorMessage);
  }
};

export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/api/orders");
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
    throw new Error(errorMessage);
  }
};
