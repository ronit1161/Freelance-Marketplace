import apiClient from "./apiClient";

export const createOrder = async (orderData) => {
  try {
    const gigId = orderData.gigId || orderData.gig?.id;
    const requirements = (orderData.requirements || orderData.brief || "").trim();

    const response = await apiClient.post("/orders", {
      gigId: Number(gigId),
      requirements: requirements,
    });
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "Failed to place order.";
    throw new Error(errorMessage);
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch order details.";
    throw new Error(errorMessage);
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/accept`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to accept order.";
    throw new Error(errorMessage);
  }
};

export const startOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/start`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to start order.";
    throw new Error(errorMessage);
  }
};

export const completeOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/complete`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to complete order.";
    throw new Error(errorMessage);
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`);
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to cancel order.";
    throw new Error(errorMessage);
  }
};

export const getClientOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data?.data || response.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch client orders.";
    throw new Error(errorMessage);
  }
};

export const getFreelancerOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data?.data || response.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer orders.";
    throw new Error(errorMessage);
  }
};

export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data?.data || response.data || [];
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
    throw new Error(errorMessage);
  }
};

export const getOrder = async ({ userId, limit = 10, page = 1 } = {}) => {
  const ordersData = await getClientOrders();
  const totalPages = Math.max(1, Math.ceil((ordersData?.length || 0) / limit));
  return { orders: ordersData || [], totalPages };
};
