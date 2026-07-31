package com.freelancemarketplace.modules.order.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freelancemarketplace.enums.OrderStatus;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;
import com.freelancemarketplace.modules.order.entity.Order;
import com.freelancemarketplace.modules.order.mapper.OrderMapper;
import com.freelancemarketplace.modules.order.records.CreateOrderRecord;
import com.freelancemarketplace.modules.order.records.OrderResponseRecord;
import com.freelancemarketplace.modules.order.repository.OrderRepository;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{
	
	private final GigRepository gigRepo;
	private final UserRepository userRepo;
	private final OrderRepository orderRepo;
	private final OrderMapper orderMapper;

	@Override
	@Transactional
	public OrderResponseRecord createOrder(@Valid CreateOrderRecord dto) {
		
		Gigs gig = gigRepo.findById(dto.gig().getId())
				.orElseThrow(() -> new RuntimeException("Gig not found"));
		
		User client = userRepo.findById(dto.client().getId())
				.orElseThrow(() -> new RuntimeException("Client not found"));
		
		User freelancer = userRepo.findById(dto.freelancer().getId())
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));
		
		if (client.getId().equals(freelancer.getId())) {
            throw new RuntimeException("Freelancers cannot order their own gigs");
        }
		
		Order order = new Order();
        order.setGig(gig);
        order.setClient(client);
        order.setFreelancer(freelancer);
        order.setAgreedPrice(dto.agreedPrice());
        order.setRequirements(dto.requirements());
        order.setStatus(OrderStatus.PENDING);
        
        // Increment total orders count on the gig
        gig.setTotalOrders(gig.getTotalOrders() == null ? 1 : gig.getTotalOrders() + 1);
        gigRepo.save(gig);
        Order savedOrder = orderRepo.save(order);
        return orderMapper.toDto(savedOrder);
	}

	@Override
	public List<OrderResponseRecord> getOrders(Long userId, String role) {
		List<Order> orders;
		
		if(userId != null && "CLIENT".equalsIgnoreCase(role)) {
			orders = orderRepo.findByClientId(userId);
		} else if(userId != null && "FREELANCER".equalsIgnoreCase(role)) {
			orders = orderRepo.findByFreelancerId(userId);
		} else if(userId != null) {
			orders = orderRepo.findByClientIdOrFreelancerId(userId, userId);
		} else {
			orders = orderRepo.findAll();
		}
		
		return orderMapper.toDtoList(orders);
	}
	


	@Override
    public OrderResponseRecord getOrderById(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toDto(order);
    }

	@Override
	@Transactional
	public OrderResponseRecord completeOrder(Long orderId) {
		Order order = orderRepo.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found"));
		
		order.setStatus(OrderStatus.COMPLETED);
		return orderMapper.toDto(orderRepo.save(order));
	}

	@Override
	@Transactional
	public OrderResponseRecord acceptOrder(Long orderId) {
		Order order = orderRepo.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found"));
		
		order.setStatus(OrderStatus.IN_PROGRESS);
		return orderMapper.toDto(orderRepo.save(order));
	}

	@Override
    @Transactional
    public OrderResponseRecord cancelOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
        return orderMapper.toDto(orderRepo.save(order));
    }

}
