package com.freelancemarketplace.reviewservice.service;

import com.freelancemarketplace.reviewservice.client.OrderClient;
import com.freelancemarketplace.reviewservice.client.dto.OrderResponse;
import com.freelancemarketplace.reviewservice.dto.request.CreateReviewRequest;
import com.freelancemarketplace.reviewservice.dto.response.ReviewResponse;
import com.freelancemarketplace.reviewservice.entity.Review;
import com.freelancemarketplace.reviewservice.repository.ReviewRepository;
import com.freelancemarketplace.reviewservice.service.impl.ReviewServiceImpl;
import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.shared.exception.BadRequestException;
import com.freelancemarketplace.shared.exception.ConflictException;
import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private OrderClient orderClient;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private OrderResponse sampleOrder;
    private Review sampleReview;

    @BeforeEach
    void setUp() {
        sampleOrder = OrderResponse.builder()
                .id(1L)
                .clientId(100L)
                .freelancerId(200L)
                .gigId(10L)
                .agreedPrice(BigDecimal.valueOf(500.00))
                .status("COMPLETED")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleReview = Review.builder()
                .id(50L)
                .orderId(1L)
                .clientId(100L)
                .freelancerId(200L)
                .gigId(10L)
                .rating(5)
                .comment("Excellent delivery, highly recommended!")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Client should successfully submit a review for a completed order")
    void createReview_Success() {
        CreateReviewRequest request = CreateReviewRequest.builder()
                .orderId(1L)
                .rating(5)
                .comment("Excellent delivery, highly recommended!")
                .build();

        when(reviewRepository.existsByOrderId(1L)).thenReturn(false);
        when(orderClient.getOrderById(1L, 100L, "ROLE_CLIENT")).thenReturn(ApiResponse.success(sampleOrder));
        when(reviewRepository.save(any(Review.class))).thenAnswer(i -> {
            Review r = i.getArgument(0);
            r.setId(50L);
            return r;
        });

        ReviewResponse response = reviewService.createReview(request, 100L, "ROLE_CLIENT");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(50L);
        assertThat(response.getOrderId()).isEqualTo(1L);
        assertThat(response.getClientId()).isEqualTo(100L);
        assertThat(response.getFreelancerId()).isEqualTo(200L);
        assertThat(response.getGigId()).isEqualTo(10L);
        assertThat(response.getRating()).isEqualTo(5);

        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    @DisplayName("Submitting duplicate review for the same order should throw ConflictException")
    void createReview_Duplicate_ThrowsConflictException() {
        CreateReviewRequest request = CreateReviewRequest.builder()
                .orderId(1L)
                .rating(5)
                .build();

        when(reviewRepository.existsByOrderId(1L)).thenReturn(true);

        assertThatThrownBy(() -> reviewService.createReview(request, 100L, "ROLE_CLIENT"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already been submitted");

        verifyNoInteractions(orderClient);
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Submitting review for non-completed order should throw BadRequestException")
    void createReview_OrderNotCompleted_ThrowsBadRequestException() {
        sampleOrder.setStatus("IN_PROGRESS");
        CreateReviewRequest request = CreateReviewRequest.builder()
                .orderId(1L)
                .rating(5)
                .build();

        when(reviewRepository.existsByOrderId(1L)).thenReturn(false);
        when(orderClient.getOrderById(1L, 100L, "ROLE_CLIENT")).thenReturn(ApiResponse.success(sampleOrder));

        assertThatThrownBy(() -> reviewService.createReview(request, 100L, "ROLE_CLIENT"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Reviews can only be submitted for completed orders");

        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Client trying to review another user's order should throw ForbiddenException")
    void createReview_NotOrderOwner_ThrowsForbiddenException() {
        sampleOrder.setClientId(999L); // Order was placed by user 999
        CreateReviewRequest request = CreateReviewRequest.builder()
                .orderId(1L)
                .rating(5)
                .build();

        when(reviewRepository.existsByOrderId(1L)).thenReturn(false);
        when(orderClient.getOrderById(1L, 100L, "ROLE_CLIENT")).thenReturn(ApiResponse.success(sampleOrder));

        assertThatThrownBy(() -> reviewService.createReview(request, 100L, "ROLE_CLIENT"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Only the client who placed this order can submit a review");

        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Freelancer should be forbidden from submitting a review")
    void createReview_FreelancerRole_ThrowsForbiddenException() {
        CreateReviewRequest request = CreateReviewRequest.builder()
                .orderId(1L)
                .rating(5)
                .build();

        assertThatThrownBy(() -> reviewService.createReview(request, 200L, "ROLE_FREELANCER"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Only clients are permitted to submit a review");
    }

    @Test
    @DisplayName("Should successfully retrieve reviews by Gig ID")
    void getReviewsByGigId_Success() {
        when(reviewRepository.findByGigIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(sampleReview));

        List<ReviewResponse> responses = reviewService.getReviewsByGigId(10L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getGigId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should successfully retrieve reviews by Freelancer ID")
    void getReviewsByFreelancerId_Success() {
        when(reviewRepository.findByFreelancerIdOrderByCreatedAtDesc(200L)).thenReturn(List.of(sampleReview));

        List<ReviewResponse> responses = reviewService.getReviewsByFreelancerId(200L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getFreelancerId()).isEqualTo(200L);
    }

    @Test
    @DisplayName("Should successfully retrieve reviews by Client ID")
    void getReviewsByClientId_Success() {
        when(reviewRepository.findByClientIdOrderByCreatedAtDesc(100L)).thenReturn(List.of(sampleReview));

        List<ReviewResponse> responses = reviewService.getReviewsByClientId(100L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getClientId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Client should successfully delete their own review")
    void deleteReview_Owner_Success() {
        when(reviewRepository.findById(50L)).thenReturn(Optional.of(sampleReview));

        reviewService.deleteReview(50L, 100L, "ROLE_CLIENT");

        verify(reviewRepository).delete(sampleReview);
    }

    @Test
    @DisplayName("Admin should successfully delete any review")
    void deleteReview_Admin_Success() {
        when(reviewRepository.findById(50L)).thenReturn(Optional.of(sampleReview));

        reviewService.deleteReview(50L, 999L, "ROLE_ADMIN");

        verify(reviewRepository).delete(sampleReview);
    }

    @Test
    @DisplayName("Unauthorized user should be forbidden from deleting someone else's review")
    void deleteReview_Unauthorized_ThrowsForbiddenException() {
        when(reviewRepository.findById(50L)).thenReturn(Optional.of(sampleReview));

        assertThatThrownBy(() -> reviewService.deleteReview(50L, 300L, "ROLE_CLIENT"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("You do not have permission to delete this review");

        verify(reviewRepository, never()).delete(any());
    }
}
