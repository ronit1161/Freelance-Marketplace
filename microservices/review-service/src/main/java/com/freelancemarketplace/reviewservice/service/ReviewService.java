package com.freelancemarketplace.reviewservice.service;

import com.freelancemarketplace.reviewservice.dto.request.CreateReviewRequest;
import com.freelancemarketplace.reviewservice.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(CreateReviewRequest request, Long authenticatedUserId, String userRole);

    ReviewResponse getReviewById(Long id);

    List<ReviewResponse> getReviewsByGigId(Long gigId);

    List<ReviewResponse> getReviewsByFreelancerId(Long freelancerId);

    List<ReviewResponse> getReviewsByClientId(Long clientId);

    void deleteReview(Long id, Long authenticatedUserId, String userRole);
}
