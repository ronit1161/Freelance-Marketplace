import apiClient from "./apiClient";

export const createOrder = async (orderData) => {
  const response = await apiClient.post("/orders", orderData);
  return response.data;
};

export const getOrders = async (params = {}) => {
  const response = await apiClient.get("/orders", { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

export const acceptOrder = async (orderId) => {
  const response = await apiClient.put(`/orders/${orderId}/accept`);
  return response.data;
};

export const completeOrder = async (orderId) => {
  const response = await apiClient.put(`/orders/${orderId}/complete`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await apiClient.delete(`/orders/${orderId}`);
  return response.data;
};
