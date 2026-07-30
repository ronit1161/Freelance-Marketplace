package com.freelancemarketplace.modules.review.service;

import java.util.List;

import com.freelancemarketplace.modules.review.record.CreateReviewRecord;
import com.freelancemarketplace.modules.review.record.ReviewResponseRecord;

public interface ReviewService {


    ReviewResponseRecord createReview(CreateReviewRecord request);


    List<ReviewResponseRecord> getReviewsByFreelancer(Long freelancerId);


    List<ReviewResponseRecord> getReviewsByGig(Long gigId);


    List<ReviewResponseRecord> getReviewsByClient(Long clientId);


    void deleteReview(Long id);

}
