package com.freelancemarketplace.modules.order.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.order.records.CreateOrderRecord;
import com.freelancemarketplace.modules.order.records.OrderResponseRecord;
import com.freelancemarketplace.modules.order.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.freelancemarketplace.security.CustomUserDetails;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;
import com.freelancemarketplace.modules.user.entity.User;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;
	
	// POST /orders
	@PostMapping
	public ResponseEntity<ApiResponse<OrderResponseRecord>> createOrder(
			@Valid @RequestBody CreateOrderRecord dto,
			@AuthenticationPrincipal CustomUserDetails userDetails){
		
		// If authenticated, ensure client ID matches JWT
		CreateOrderRecord effectiveDto = dto;
		if (userDetails != null && dto.client() != null) {
			User clientUser = new User();
			clientUser.setId(userDetails.getId());
			effectiveDto = new CreateOrderRecord(
				dto.requirements(),
				dto.agreedPrice(),
				dto.status(),
				clientUser,
				dto.freelancer(),
				dto.gig()
			);
		}
		
		OrderResponseRecord response = orderService.createOrder(effectiveDto);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success(response, "Order created successfully"));
	}
	
	// GET /orders?userId=1&role=CLIENT
	@GetMapping
	public ResponseEntity<ApiResponse<List<OrderResponseRecord>>> getOrders(
				@RequestParam(required = false) Long userId,
				@RequestParam(required = false) String role,
				@AuthenticationPrincipal CustomUserDetails userDetails
			){
		Long effectiveUserId = (userId != null) ? userId : (userDetails != null ? userDetails.getId() : null);
		List<OrderResponseRecord> orders = orderService.getOrders(effectiveUserId, role);
		return ResponseEntity.ok(ApiResponse.success(orders));
	}
	
	// GET /orders/{orderId}
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseRecord>> getOrderById(
            @PathVariable Long orderId) {
        OrderResponseRecord order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(ApiResponse.success(order));
    }
	
	// PUT /orders/{orderId}/complete
	@PutMapping("/{orderId}/complete")
    public ResponseEntity<ApiResponse<OrderResponseRecord>> completeOrder(
            @PathVariable Long orderId) {
        OrderResponseRecord updated = orderService.completeOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(updated, "Order completed"));
    }
	
	// PUT /orders/{orderId}/accept
    @PutMapping("/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponseRecord>> acceptOrder(
            @PathVariable Long orderId) {
        OrderResponseRecord updated = orderService.acceptOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(updated, "Order accepted"));
    }

	// PUT /orders/{orderId}/reject
    @PutMapping("/{orderId}/reject")
    public ResponseEntity<ApiResponse<OrderResponseRecord>> rejectOrder(
            @PathVariable Long orderId) {
        OrderResponseRecord cancelled = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Order rejected"));
    }
    
    // DELETE /orders/{orderId}
    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseRecord>> cancelOrder(
            @PathVariable Long orderId) {
        OrderResponseRecord cancelled = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Order cancelled"));
    }
}
