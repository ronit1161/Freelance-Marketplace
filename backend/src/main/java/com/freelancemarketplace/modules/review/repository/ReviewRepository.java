package com.freelancemarketplace.modules.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.freelancemarketplace.modules.review.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {


    // Reviews received by freelancer
    List<Review> findByFreelancerId(Long freelancerId);


    // Reviews submitted by client
    List<Review> findByClientId(Long clientId);


    // Reviews for a specific gig through Order
    @Query("""
            SELECT r 
            FROM Review r
            WHERE r.order.gig.id = :gigId
            """)
    List<Review> findByGigId(Long gigId);

}
