package com.freelancemarketplace.reviewservice.repository;

import com.freelancemarketplace.reviewservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    List<Review> findByGigIdOrderByCreatedAtDesc(Long gigId);

    List<Review> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);

    List<Review> findByClientIdOrderByCreatedAtDesc(Long clientId);
}
