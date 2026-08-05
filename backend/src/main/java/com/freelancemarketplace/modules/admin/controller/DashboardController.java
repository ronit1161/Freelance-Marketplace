package com.freelancemarketplace.modules.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;
import com.freelancemarketplace.modules.order.entity.Order;
import com.freelancemarketplace.modules.order.repository.OrderRepository;
import com.freelancemarketplace.modules.user.repository.UserRepository;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final GigRepository gigRepository;
    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalGigs = gigRepository.count();
        long totalOrders = orderRepository.count();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .map(Order::getAgreedPrice)
                .filter(price -> price != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers,
                "totalGigs", totalGigs,
                "totalOrders", totalOrders,
                "totalRevenue", totalRevenue
        );

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

