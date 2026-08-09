package com.freelancemarketplace.orderservice.service;

import com.freelancemarketplace.orderservice.dto.request.CreateOrderRequest;
import com.freelancemarketplace.orderservice.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request, Long authenticatedUserId, String userRole);

    OrderResponse getOrderById(Long id, Long authenticatedUserId, String userRole);

    List<OrderResponse> getMyOrders(Long authenticatedUserId, String userRole);

    OrderResponse acceptOrder(Long id, Long authenticatedUserId, String userRole);

    OrderResponse startOrder(Long id, Long authenticatedUserId, String userRole);

    OrderResponse completeOrder(Long id, Long authenticatedUserId, String userRole);

    OrderResponse cancelOrder(Long id, Long authenticatedUserId, String userRole);
}
