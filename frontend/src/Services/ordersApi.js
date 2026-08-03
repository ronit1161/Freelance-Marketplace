import {
  createOrder as apiCreateOrder,
  acceptOrder as apiAcceptOrder,
  startOrder as apiStartOrder,
  completeOrder as apiCompleteOrder,
  cancelOrder as apiCancelOrder,
  getClientOrders as apiGetClientOrders,
  getFreelancerOrders as apiGetFreelancerOrders,
  getAllOrders as apiGetAllOrders,
} from "../services/orderApi";

export async function createOrder(payload) {
  return await apiCreateOrder({
    clientId: payload.client_id || payload.clientId,
    gigId: payload.gig_id || payload.gigId,
    requirements: payload.requirements,
  });
}

export async function getOrder({ userId, limit = 10, page = 1 } = {}) {
  try {
    const rawOrders = userId
      ? await apiGetClientOrders(userId)
      : await apiGetAllOrders();

    const ordersList = Array.isArray(rawOrders) ? rawOrders : [];
    const start = (page - 1) * limit;
    const paginatedOrders = ordersList.slice(start, start + limit);
    return {
      orders: paginatedOrders,
      totalPages: Math.max(1, Math.ceil((ordersList.length || 0) / limit)),
    };
  } catch (error) {
    console.error("Failed to fetch orders in getOrder:", error);
    return { orders: [], totalPages: 1 };
  }
}

export async function getClientOrders(clientId) {
  return await apiGetClientOrders(clientId);
}

export async function getFreelancerOrders(freelancerId) {
  return await apiGetFreelancerOrders(freelancerId);
}

export async function acceptOrder(orderId, freelancerId) {
  return await apiAcceptOrder(orderId, freelancerId);
}

export async function startOrder(orderId, freelancerId) {
  return await apiStartOrder(orderId, freelancerId);
}

export async function completeOrder(orderId, freelancerId) {
  return await apiCompleteOrder(orderId, freelancerId);
}

export async function cancelOrder(orderId, userId) {
  return await apiCancelOrder(orderId, userId);
}
