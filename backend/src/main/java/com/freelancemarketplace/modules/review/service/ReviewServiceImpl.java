package com.freelancemarketplace.modules.review.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.review.entity.Review;
import com.freelancemarketplace.modules.review.mapper.ReviewMapper;
import com.freelancemarketplace.modules.review.record.CreateReviewRecord;
import com.freelancemarketplace.modules.review.record.ReviewResponseRecord;
import com.freelancemarketplace.modules.review.repository.ReviewRepository;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.modules.order.entity.Order;
import com.freelancemarketplace.modules.order.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    // POST create review
    @Override
    public ReviewResponseRecord createReview(CreateReviewRecord request) {

        User client = userRepository.findById(request.clientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        User freelancer = userRepository.findById(request.freelancerId())
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Review review = new Review();

        review.setClient(client);
        review.setFreelancer(freelancer);
        review.setOrder(order);
        review.setRating(request.rating());
        review.setComment(request.comment());

        Review savedReview = reviewRepository.save(review);

        return reviewMapper.toDto(savedReview);
    }

    // GET freelancer reviews
    @Override
    public List<ReviewResponseRecord> getReviewsByFreelancer(Long freelancerId) {

        List<Review> reviews = reviewRepository.findByFreelancerId(freelancerId);

        List<ReviewResponseRecord> responseList = new ArrayList<>();

        for (Review review : reviews) {
            responseList.add(reviewMapper.toDto(review));
        }

        return responseList;
    }

    // GET gig review
    @Override
    public List<ReviewResponseRecord> getReviewsByGig(Long gigId) {

        List<Review> reviews = reviewRepository.findByGigId(gigId);

        List<ReviewResponseRecord> responseList = new ArrayList<>();

        for (Review review : reviews) {
            responseList.add(reviewMapper.toDto(review));
        }

        return responseList;
    }

    // GET client reviews
    @Override
    public List<ReviewResponseRecord> getReviewsByClient(Long clientId) {

        List<Review> reviews = reviewRepository.findByClientId(clientId);

        List<ReviewResponseRecord> responseList = new ArrayList<>();

        for (Review review : reviews) {
            responseList.add(reviewMapper.toDto(review));
        }

        return responseList;
    }

    // soft delete
    @Override
    public void deleteReview(Long id) {

        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found");
        }

        reviewRepository.deleteById(id);
    }

}
