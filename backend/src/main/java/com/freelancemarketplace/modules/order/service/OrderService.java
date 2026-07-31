package com.freelancemarketplace.modules.order.service;

import java.util.List;

import com.freelancemarketplace.modules.order.records.CreateOrderRecord;
import com.freelancemarketplace.modules.order.records.OrderResponseRecord;

import jakarta.validation.Valid;

public interface OrderService {

	OrderResponseRecord createOrder(@Valid CreateOrderRecord dto);

	List<OrderResponseRecord> getOrders(Long userId, String role);

	OrderResponseRecord completeOrder(Long orderId);

	OrderResponseRecord acceptOrder(Long orderId);

	OrderResponseRecord getOrderById(Long orderId);

	OrderResponseRecord cancelOrder(Long orderId);

}
