package com.freelancemarketplace.reviewservice.client;

import com.freelancemarketplace.reviewservice.client.dto.OrderResponse;
import com.freelancemarketplace.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "order-service", path = "/orders")
public interface OrderClient {

    @GetMapping("/{id}")
    ApiResponse<OrderResponse> getOrderById(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    );
}
