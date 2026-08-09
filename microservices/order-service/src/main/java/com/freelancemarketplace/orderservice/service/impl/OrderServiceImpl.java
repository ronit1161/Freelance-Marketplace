package com.freelancemarketplace.orderservice.service.impl;

import com.freelancemarketplace.orderservice.client.GigClient;
import com.freelancemarketplace.orderservice.client.dto.GigResponse;
import com.freelancemarketplace.orderservice.dto.request.CreateOrderRequest;
import com.freelancemarketplace.orderservice.dto.response.OrderResponse;
import com.freelancemarketplace.orderservice.entity.Order;
import com.freelancemarketplace.orderservice.entity.OrderStatus;
import com.freelancemarketplace.orderservice.repository.OrderRepository;
import com.freelancemarketplace.orderservice.service.OrderService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.shared.exception.*;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final GigClient gigClient;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceClient(userRole, "create an order");

        // 1. Fetch Gig from Gig Service via OpenFeign
        GigResponse gig = fetchGig(request.getGigId());

        if (!gig.isActive()) {
            throw new BadRequestException("Gig is not active and cannot be ordered");
        }

        // 2. Prevent Self-Ordering
        if (gig.getFreelancerId().equals(authenticatedUserId)) {
            throw new BadRequestException("You cannot place an order on your own gig");
        }

        // 3. Create Order with verified data
        Order order = Order.builder()
                .clientId(authenticatedUserId)
                .freelancerId(gig.getFreelancerId())
                .gigId(gig.getId())
                .agreedPrice(gig.getPrice())
                .requirements(request.getRequirements().trim())
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Client ID {} successfully created Order ID: {} for Gig ID: {}", authenticatedUserId, savedOrder.getId(), gig.getId());
        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        boolean isClient = order.getClientId().equals(authenticatedUserId);
        boolean isFreelancer = order.getFreelancerId().equals(authenticatedUserId);
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole);

        if (!isClient && !isFreelancer && !isAdmin) {
            log.warn("Access denied: User ID {} (role '{}') tried to access Order ID {} (Client: {}, Freelancer: {})",
                    authenticatedUserId, userRole, id, order.getClientId(), order.getFreelancerId());
            throw new ForbiddenException("You do not have permission to view this order");
        }

        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);

        List<Order> orders;
        if ("ROLE_CLIENT".equalsIgnoreCase(userRole)) {
            orders = orderRepository.findByClientIdOrderByCreatedAtDesc(authenticatedUserId);
        } else if ("ROLE_FREELANCER".equalsIgnoreCase(userRole)) {
            orders = orderRepository.findByFreelancerIdOrderByCreatedAtDesc(authenticatedUserId);
        } else if ("ROLE_ADMIN".equalsIgnoreCase(userRole)) {
            orders = orderRepository.findAll();
        } else {
            orders = orderRepository.findByClientIdOrderByCreatedAtDesc(authenticatedUserId);
        }

        return orders.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse acceptOrder(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceFreelancer(userRole, "accept an order");

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (!order.getFreelancerId().equals(authenticatedUserId)) {
            throw new ForbiddenException("Only the assigned freelancer can accept this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Only PENDING orders can be accepted. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.ACCEPTED);
        Order updatedOrder = orderRepository.save(order);
        log.info("Freelancer ID {} accepted Order ID: {}", authenticatedUserId, id);
        return mapToResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse startOrder(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceFreelancer(userRole, "start work on an order");

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (!order.getFreelancerId().equals(authenticatedUserId)) {
            throw new ForbiddenException("Only the assigned freelancer can start this order");
        }

        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new BadRequestException("Only ACCEPTED orders can be marked as IN_PROGRESS. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.IN_PROGRESS);
        Order updatedOrder = orderRepository.save(order);
        log.info("Freelancer ID {} marked Order ID: {} as IN_PROGRESS", authenticatedUserId, id);
        return mapToResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse completeOrder(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceFreelancer(userRole, "complete an order");

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (!order.getFreelancerId().equals(authenticatedUserId)) {
            throw new ForbiddenException("Only the assigned freelancer can complete this order");
        }

        if (order.getStatus() != OrderStatus.IN_PROGRESS) {
            throw new BadRequestException("Only IN_PROGRESS orders can be marked as COMPLETED. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.COMPLETED);
        Order updatedOrder = orderRepository.save(order);
        log.info("Freelancer ID {} marked Order ID: {} as COMPLETED", authenticatedUserId, id);
        return mapToResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        boolean isClient = order.getClientId().equals(authenticatedUserId);
        boolean isFreelancer = order.getFreelancerId().equals(authenticatedUserId);
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole);

        if (!isClient && !isFreelancer && !isAdmin) {
            throw new ForbiddenException("You do not have permission to cancel this order");
        }

        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel an order that is already " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        log.info("Order ID: {} cancelled by User ID: {} (role '{}')", id, authenticatedUserId, userRole);
        return mapToResponse(updatedOrder);
    }

    private GigResponse fetchGig(Long gigId) {
        try {
            ApiResponse<GigResponse> response = gigClient.getGigById(gigId);
            if (response == null || response.getData() == null) {
                throw new ResourceNotFoundException("Gig", "id", gigId);
            }
            return response.getData();
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Gig", "id", gigId);
        } catch (FeignException e) {
            log.error("Feign error communicating with Gig Service for Gig ID {}: {}", gigId, e.getMessage());
            throw new ApiException("Gig Service is currently unavailable. Please try again later.", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (Exception e) {
            if (e instanceof ApiException) throw (ApiException) e;
            log.error("Unexpected error communicating with Gig Service for Gig ID {}: {}", gigId, e.getMessage());
            throw new ApiException("Gig Service is currently unavailable. Please try again later.", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private void enforceAuthentication(Long authenticatedUserId) {
        if (authenticatedUserId == null) {
            throw new UnauthorizedException("Authentication is required to perform this action");
        }
    }

    private void enforceClient(String userRole, String action) {
        if (userRole == null || !"ROLE_CLIENT".equalsIgnoreCase(userRole)) {
            log.warn("Role check failed: User with role '{}' attempted to {}", userRole, action);
            throw new ForbiddenException("Only clients are permitted to " + action);
        }
    }

    private void enforceFreelancer(String userRole, String action) {
        if (userRole == null || !"ROLE_FREELANCER".equalsIgnoreCase(userRole)) {
            log.warn("Role check failed: User with role '{}' attempted to {}", userRole, action);
            throw new ForbiddenException("Only freelancers are permitted to " + action);
        }
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .clientId(order.getClientId())
                .freelancerId(order.getFreelancerId())
                .gigId(order.getGigId())
                .agreedPrice(order.getAgreedPrice())
                .requirements(order.getRequirements())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
