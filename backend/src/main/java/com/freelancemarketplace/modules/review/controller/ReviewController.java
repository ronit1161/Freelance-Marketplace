package com.freelancemarketplace.modules.review.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.freelancemarketplace.modules.review.record.CreateReviewRecord;
import com.freelancemarketplace.modules.review.record.ReviewResponseRecord;
import com.freelancemarketplace.modules.review.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.security.CustomUserDetails;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponseRecord>> createReview(
            @Valid @RequestBody CreateReviewRecord request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long effectiveClientId = (userDetails != null) ? userDetails.getId() : request.clientId();
        CreateReviewRecord effectiveRequest = new CreateReviewRecord(
                effectiveClientId,
                request.freelancerId(),
                request.orderId(),
                request.rating(),
                request.comment()
        );

        ReviewResponseRecord created = reviewService.createReview(effectiveRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Review submitted successfully"));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseRecord>>> getReviewsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByFreelancer(freelancerId)));
    }

    @GetMapping("/gig/{gigId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseRecord>>> getReviewsByGig(@PathVariable Long gigId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByGig(gigId)));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseRecord>>> getReviewsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByClient(clientId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Review deleted successfully"));
    }
}
