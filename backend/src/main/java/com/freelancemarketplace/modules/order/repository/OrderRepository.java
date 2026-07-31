package com.freelancemarketplace.modules.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.order.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{

	List<Order> findByClientId(Long userId);

	List<Order> findByFreelancerId(Long userId);

	List<Order> findByClientIdOrFreelancerId(Long userId, Long freelancerId);

}
