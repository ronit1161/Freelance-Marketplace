package com.freelancemarketplace.modules.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.review.record.ReviewResponseRecord;
import com.freelancemarketplace.modules.review.repository.ReviewRepository;
import com.freelancemarketplace.modules.review.service.ReviewService;

import com.freelancemarketplace.modules.review.mapper.ReviewMapper;

@RestController
@RequestMapping("/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponseRecord>>> getAllReviews() {
        List<ReviewResponseRecord> reviews = reviewRepository.findAll()
                .stream()
                .map(reviewMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
