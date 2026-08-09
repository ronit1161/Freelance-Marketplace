package com.freelancemarketplace.orderservice.repository;

import com.freelancemarketplace.orderservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByClientIdOrderByCreatedAtDesc(Long clientId);

    List<Order> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);

    List<Order> findByGigIdOrderByCreatedAtDesc(Long gigId);
}
