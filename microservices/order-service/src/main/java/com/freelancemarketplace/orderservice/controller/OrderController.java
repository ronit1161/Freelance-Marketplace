package com.freelancemarketplace.orderservice.controller;

import com.freelancemarketplace.orderservice.dto.request.CreateOrderRequest;
import com.freelancemarketplace.orderservice.dto.response.OrderResponse;
import com.freelancemarketplace.orderservice.service.OrderService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        OrderResponse response = orderService.createOrder(request, authenticatedUserId, authenticatedUserRole);
        return new ResponseEntity<>(ApiResponse.success("Order placed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        OrderResponse response = orderService.getOrderById(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        List<OrderResponse> response = orderService.getMyOrders(authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        List<OrderResponse> response = orderService.getMyOrders(authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @RequestMapping(value = "/{id}/accept", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        OrderResponse response = orderService.acceptOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order accepted successfully", response));
    }

    @RequestMapping(value = "/{id}/start", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<OrderResponse>> startOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        OrderResponse response = orderService.startOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order marked as in progress", response));
    }

    @RequestMapping(value = "/{id}/complete", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        OrderResponse response = orderService.completeOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order completed successfully", response));
    }

    @RequestMapping(value = {"/{id}/cancel", "/{id}/reject"}, method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        OrderResponse response = orderService.cancelOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", response));
    }
}
