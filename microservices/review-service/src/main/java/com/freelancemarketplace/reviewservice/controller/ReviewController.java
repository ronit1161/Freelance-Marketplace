package com.freelancemarketplace.reviewservice.controller;

import com.freelancemarketplace.reviewservice.dto.request.CreateReviewRequest;
import com.freelancemarketplace.reviewservice.dto.response.ReviewResponse;
import com.freelancemarketplace.reviewservice.service.ReviewService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        ReviewResponse response = reviewService.createReview(request, authenticatedUserId, authenticatedUserRole);
        return new ResponseEntity<>(ApiResponse.success("Review submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(@PathVariable Long id) {
        ReviewResponse response = reviewService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/gig/{gigId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByGig(@PathVariable Long gigId) {
        List<ReviewResponse> response = reviewService.getReviewsByGigId(gigId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByFreelancer(@PathVariable Long freelancerId) {
        List<ReviewResponse> response = reviewService.getReviewsByFreelancerId(freelancerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByClient(@PathVariable Long clientId) {
        List<ReviewResponse> response = reviewService.getReviewsByClientId(clientId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        reviewService.deleteReview(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
