package com.freelancemarketplace.reviewservice.service.impl;

import com.freelancemarketplace.reviewservice.client.OrderClient;
import com.freelancemarketplace.reviewservice.client.dto.OrderResponse;
import com.freelancemarketplace.reviewservice.dto.request.CreateReviewRequest;
import com.freelancemarketplace.reviewservice.dto.response.ReviewResponse;
import com.freelancemarketplace.reviewservice.entity.Review;
import com.freelancemarketplace.reviewservice.repository.ReviewRepository;
import com.freelancemarketplace.reviewservice.service.ReviewService;
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
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderClient orderClient;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);
        enforceClient(userRole, "submit a review");

        // 1. One review per order validation
        if (reviewRepository.existsByOrderId(request.getOrderId())) {
            log.warn("Duplicate review attempt for Order ID {}", request.getOrderId());
            throw new ConflictException("A review has already been submitted for this order");
        }

        // 2. Fetch Order from Order Service via OpenFeign
        OrderResponse order = fetchOrder(request.getOrderId(), authenticatedUserId, userRole);

        // 3. Verify order is COMPLETED
        if (!"COMPLETED".equalsIgnoreCase(order.getStatus())) {
            log.warn("Review submission rejected for Order ID {}: Status is {}", request.getOrderId(), order.getStatus());
            throw new BadRequestException("Reviews can only be submitted for completed orders. Current order status: " + order.getStatus());
        }

        // 4. Verify client ownership
        if (!order.getClientId().equals(authenticatedUserId)) {
            log.warn("Client mismatch: Authenticated User ID {} tried to review Order ID {} belonging to Client ID {}",
                    authenticatedUserId, request.getOrderId(), order.getClientId());
            throw new ForbiddenException("Only the client who placed this order can submit a review");
        }

        // 5. Persist Review
        Review review = Review.builder()
                .orderId(order.getId())
                .clientId(authenticatedUserId)
                .freelancerId(order.getFreelancerId())
                .gigId(order.getGigId())
                .rating(request.getRating())
                .comment(request.getComment() != null ? request.getComment().trim() : null)
                .build();

        Review savedReview = reviewRepository.save(review);
        log.info("Client ID {} successfully submitted Review ID {} for Order ID {} (Rating: {})",
                authenticatedUserId, savedReview.getId(), order.getId(), request.getRating());

        return mapToResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        return mapToResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByGigId(Long gigId) {
        return reviewRepository.findByGigIdOrderByCreatedAtDesc(gigId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByFreelancerId(Long freelancerId) {
        return reviewRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByClientId(Long clientId) {
        return reviewRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteReview(Long id, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));

        boolean isOwner = review.getClientId().equals(authenticatedUserId);
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole);

        if (!isOwner && !isAdmin) {
            log.warn("Access denied: User ID {} (role '{}') tried to delete Review ID {} owned by Client ID {}",
                    authenticatedUserId, userRole, id, review.getClientId());
            throw new ForbiddenException("You do not have permission to delete this review");
        }

        reviewRepository.delete(review);
        log.info("Review ID {} deleted by User ID {} (role '{}')", id, authenticatedUserId, userRole);
    }

    private OrderResponse fetchOrder(Long orderId, Long authenticatedUserId, String userRole) {
        try {
            ApiResponse<OrderResponse> response = orderClient.getOrderById(orderId, authenticatedUserId, userRole);
            if (response == null || response.getData() == null) {
                throw new ResourceNotFoundException("Order", "id", orderId);
            }
            return response.getData();
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        } catch (FeignException.Forbidden e) {
            throw new ForbiddenException("You do not have permission to access this order");
        } catch (FeignException e) {
            log.error("Feign error communicating with Order Service for Order ID {}: {}", orderId, e.getMessage());
            throw new ApiException("Order Service is currently unavailable. Please try again later.", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (Exception e) {
            if (e instanceof ApiException) throw (ApiException) e;
            log.error("Unexpected error communicating with Order Service for Order ID {}: {}", orderId, e.getMessage());
            throw new ApiException("Order Service is currently unavailable. Please try again later.", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private void enforceAuthentication(Long userId) {
        if (userId == null) {
            throw new UnauthorizedException("Authentication is required to perform this action");
        }
    }

    private void enforceClient(String userRole, String action) {
        if (userRole == null || !"ROLE_CLIENT".equalsIgnoreCase(userRole)) {
            log.warn("Role check failed: User with role '{}' attempted to {}", userRole, action);
            throw new ForbiddenException("Only clients are permitted to " + action);
        }
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .orderId(review.getOrderId())
                .clientId(review.getClientId())
                .freelancerId(review.getFreelancerId())
                .gigId(review.getGigId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
