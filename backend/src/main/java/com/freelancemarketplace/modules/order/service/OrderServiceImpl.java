package com.freelancemarketplace.modules.order.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.freelancemarketplace.enums.OrderStatus;
import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;
import com.freelancemarketplace.modules.order.entity.Order;
import com.freelancemarketplace.modules.order.mapper.OrderMapper;
import com.freelancemarketplace.modules.order.records.CreateOrderRecord;
import com.freelancemarketplace.modules.order.records.OrderResponseRecord;
import com.freelancemarketplace.modules.order.repository.OrderRepository;
import com.freelancemarketplace.modules.transactions.records.CreateTransactionRecord;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.common.exceptions.ResourceNotFoundException;
import com.freelancemarketplace.enums.ErrorCode;
import com.freelancemarketplace.modules.walletTransactions.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.wallet.repository.WalletRepository;
import com.freelancemarketplace.modules.wallet.entity.Wallet;
import com.freelancemarketplace.modules.walletTransactions.service.WalletTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	
	private final GigRepository gigRepo;
	private final UserRepository userRepo;
	private final OrderRepository orderRepo;
	private final WalletRepository walletRepo;
	private final OrderMapper orderMapper;
	private final WalletTransactionService walletTransactionService;

	@Override
	@Transactional
	public OrderResponseRecord createOrder(@Valid CreateOrderRecord dto) {
		
		Gigs gig = gigRepo.findById(dto.gig().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Gig not found with ID: " + dto.gig().getId(), ErrorCode.GIG_NOT_FOUND));
		
		User client = userRepo.findById(dto.client().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + dto.client().getId(), ErrorCode.USER_NOT_FOUND));
		
		Long targetFreelancerId = (dto.freelancer() != null && dto.freelancer().getId() != null)
				? dto.freelancer().getId()
				: (gig.getFreelancer() != null ? gig.getFreelancer().getId() : null);

		if (targetFreelancerId == null) {
			throw new ResourceNotFoundException("Freelancer not found for this gig", ErrorCode.USER_NOT_FOUND);
		}

		User freelancer = userRepo.findById(targetFreelancerId)
				.orElseThrow(() -> new ResourceNotFoundException("Freelancer not found with ID: " + targetFreelancerId, ErrorCode.USER_NOT_FOUND));
		
		if (client.getId().equals(freelancer.getId())) {
            throw new IllegalArgumentException("You cannot place an order on your own gig.");
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

        // Ensure wallets exist for client & freelancer
        if (client.getWallet() == null) {
            Wallet clientWallet = walletRepo.save(new Wallet());
            client.setWallet(clientWallet);
            client = userRepo.save(client);
        }
        if (freelancer.getWallet() == null) {
            Wallet freelancerWallet = walletRepo.save(new Wallet());
            freelancer.setWallet(freelancerWallet);
            freelancer = userRepo.save(freelancer);
        }

        // Execute Escrow Hold transaction from Client wallet
        CreateTransactionRecord txRecord = new CreateTransactionRecord(
            dto.agreedPrice(),
            "Escrow Hold for Order #" + savedOrder.getId(),
            TransactionType.HOLD,
            TransactionStatus.PENDING
        );
        CreateWalletTransactionRecord walletTxRecord = new CreateWalletTransactionRecord(
            client.getWallet().getId(),
            freelancer.getWallet().getId(),
            txRecord
        );
        walletTransactionService.createWalletTransaction(walletTxRecord);

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
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId, ErrorCode.ORDER_NOT_FOUND));
        return orderMapper.toDto(order);
    }

	@Override
	@Transactional
	public OrderResponseRecord completeOrder(Long orderId) {
		Order order = orderRepo.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId, ErrorCode.ORDER_NOT_FOUND));
		
		if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.COMPLETED) {
			throw new IllegalStateException("Order cannot be completed from status: " + order.getStatus());
		}

		if (order.getStatus() != OrderStatus.COMPLETED) {
			// Execute Escrow Release transaction from Client to Freelancer wallet
			if (order.getClient().getWallet() != null && order.getFreelancer().getWallet() != null) {
				CreateTransactionRecord txRecord = new CreateTransactionRecord(
					order.getAgreedPrice(),
					"Escrow Release for Order #" + order.getId(),
					TransactionType.RELEASE,
					TransactionStatus.PENDING
				);
				CreateWalletTransactionRecord walletTxRecord = new CreateWalletTransactionRecord(
					order.getClient().getWallet().getId(),
					order.getFreelancer().getWallet().getId(),
					txRecord
				);
				walletTransactionService.createWalletTransaction(walletTxRecord);
			}
			order.setStatus(OrderStatus.COMPLETED);
		}

		return orderMapper.toDto(orderRepo.save(order));
	}

	@Override
	@Transactional
	public OrderResponseRecord acceptOrder(Long orderId) {
		Order order = orderRepo.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId, ErrorCode.ORDER_NOT_FOUND));
		
		if (order.getStatus() != OrderStatus.PENDING) {
			throw new IllegalStateException("Only PENDING orders can be accepted. Current status: " + order.getStatus());
		}

		order.setStatus(OrderStatus.IN_PROGRESS);
		return orderMapper.toDto(orderRepo.save(order));
	}

	@Override
    @Transactional
    public OrderResponseRecord cancelOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId, ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.IN_PROGRESS) {
            // Execute Escrow Refund transaction back to Client wallet
            if (order.getClient().getWallet() != null && order.getFreelancer().getWallet() != null) {
                CreateTransactionRecord txRecord = new CreateTransactionRecord(
                    order.getAgreedPrice(),
                    "Escrow Refund for Order #" + order.getId(),
                    TransactionType.REFUND_ESKROW,
                    TransactionStatus.PENDING
                );
                CreateWalletTransactionRecord walletTxRecord = new CreateWalletTransactionRecord(
                    order.getClient().getWallet().getId(),
                    order.getFreelancer().getWallet().getId(),
                    txRecord
                );
                walletTransactionService.createWalletTransaction(walletTxRecord);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderMapper.toDto(orderRepo.save(order));
    }

}
