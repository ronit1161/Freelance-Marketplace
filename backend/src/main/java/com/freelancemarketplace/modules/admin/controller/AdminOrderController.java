package com.freelancemarketplace.modules.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.order.records.OrderResponseRecord;
import com.freelancemarketplace.modules.order.service.OrderService;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseRecord>>> getAllOrders() {
        List<OrderResponseRecord> orders = orderService.getOrders(null, null);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseRecord>> deleteOrder(@PathVariable Long orderId) {
        OrderResponseRecord cancelled = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Order cancelled by admin"));
    }
}
