package com.freelancemarketplace.orderservice.controller;

import com.freelancemarketplace.orderservice.dto.request.CreateOrderRequest;
import com.freelancemarketplace.orderservice.dto.response.OrderResponse;
import com.freelancemarketplace.orderservice.service.OrderService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received create order request for Gig ID {} from User ID {} (role '{}')",
                request.getGigId(), authenticatedUserId, authenticatedUserRole);
        OrderResponse response = orderService.createOrder(request, authenticatedUserId, authenticatedUserRole);
        return new ResponseEntity<>(ApiResponse.success("Order placed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to fetch Order ID {} by User ID {}", id, authenticatedUserId);
        OrderResponse response = orderService.getOrderById(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to fetch orders for User ID {} (role '{}')", authenticatedUserId, authenticatedUserRole);
        List<OrderResponse> response = orderService.getMyOrders(authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to fetch orders for User ID {} (role '{}')", authenticatedUserId, authenticatedUserRole);
        List<OrderResponse> response = orderService.getMyOrders(authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @RequestMapping(value = "/{id}/accept", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to accept Order ID {} by User ID {}", id, authenticatedUserId);
        OrderResponse response = orderService.acceptOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order accepted successfully", response));
    }

    @RequestMapping(value = "/{id}/start", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<OrderResponse>> startOrder(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to start work on Order ID {} by User ID {}", id, authenticatedUserId);
        OrderResponse response = orderService.startOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order marked as in progress", response));
    }

    @RequestMapping(value = "/{id}/complete", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to complete Order ID {} by User ID {}", id, authenticatedUserId);
        OrderResponse response = orderService.completeOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order completed successfully", response));
    }

    @RequestMapping(value = {"/{id}/cancel", "/{id}/reject"}, method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to cancel/reject Order ID {} by User ID {}", id, authenticatedUserId);
        OrderResponse response = orderService.cancelOrder(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", response));
    }
}
