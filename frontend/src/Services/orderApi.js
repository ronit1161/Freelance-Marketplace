import apiClient from "./apiClient";

export const createOrder = async (orderData) => {
  try {
    const clientId = orderData.clientId || orderData.userId || orderData.client?.id;
    const gigId = orderData.gigId || orderData.gig?.id;
    const freelancerId = orderData.freelancerId || orderData.freelancer?.id || 1;
    const agreedPrice = Math.max(1, Number(orderData.agreedPrice || orderData.price || 1));
    const requirements = (orderData.requirements || orderData.brief || "").trim();

    const response = await apiClient.post("/orders", {
      requirements,
      agreedPrice,
      status: "PENDING",
      client: { id: Number(clientId) },
      freelancer: { id: Number(freelancerId) },
      gig: { id: Number(gigId) },
    });
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      "Failed to place order.";
    throw new Error(errorMessage);
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/accept`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to accept order.";
    throw new Error(errorMessage);
  }
};

export const startOrder = async (orderId) => {
  return await acceptOrder(orderId);
};

export const completeOrder = async (orderId) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/complete`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to complete order.";
    throw new Error(errorMessage);
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to cancel order.";
    throw new Error(errorMessage);
  }
};

export const getClientOrders = async (clientId) => {
  try {
    const response = await apiClient.get("/orders", {
      params: { userId: clientId, role: "CLIENT" },
    });
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch client orders.";
    throw new Error(errorMessage);
  }
};

export const getFreelancerOrders = async (freelancerId) => {
  try {
    const response = await apiClient.get("/orders", {
      params: { userId: freelancerId, role: "FREELANCER" },
    });
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch freelancer orders.";
    throw new Error(errorMessage);
  }
};

export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data.data || response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
    throw new Error(errorMessage);
  }
};

export const getOrder = async ({ userId, limit = 10, page = 1 }) => {
  const ordersData = await getClientOrders(userId);
  const totalPages = Math.max(1, Math.ceil((ordersData?.length || 0) / limit));
  return { orders: ordersData || [], totalPages };
};
