package com.freelancemarketplace.walletservice.service.impl;

import com.freelancemarketplace.shared.exception.BadRequestException;
import com.freelancemarketplace.shared.exception.ConflictException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import com.freelancemarketplace.walletservice.dto.request.LockEscrowRequest;
import com.freelancemarketplace.walletservice.dto.request.RefundEscrowRequest;
import com.freelancemarketplace.walletservice.dto.request.ReleaseEscrowRequest;
import com.freelancemarketplace.walletservice.dto.response.EscrowResponse;
import com.freelancemarketplace.walletservice.entity.Escrow;
import com.freelancemarketplace.walletservice.entity.EscrowStatus;
import com.freelancemarketplace.walletservice.entity.TransactionType;
import com.freelancemarketplace.walletservice.entity.Wallet;
import com.freelancemarketplace.walletservice.entity.WalletTransaction;
import com.freelancemarketplace.walletservice.repository.EscrowRepository;
import com.freelancemarketplace.walletservice.repository.WalletRepository;
import com.freelancemarketplace.walletservice.repository.WalletTransactionRepository;
import com.freelancemarketplace.walletservice.service.EscrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EscrowServiceImpl implements EscrowService {

    private final WalletRepository walletRepository;
    private final EscrowRepository escrowRepository;
    private final WalletTransactionRepository transactionRepository;

    @Override
    @Transactional
    public EscrowResponse lockEscrow(LockEscrowRequest request) {
        // 1. Idempotency Check
        Optional<Escrow> existingEscrowOpt = escrowRepository.findByOrderId(request.getOrderId());
        if (existingEscrowOpt.isPresent()) {
            Escrow existingEscrow = existingEscrowOpt.get();
            if (existingEscrow.getStatus() == EscrowStatus.LOCKED) {
                return mapToResponse(existingEscrow);
            }
            throw new ConflictException(String.format("Escrow for Order ID %d already exists with status %s",
                    request.getOrderId(), existingEscrow.getStatus()));
        }

        // 2. Client Wallet Check
        Wallet clientWallet = getOrCreateWallet(request.getClientId());

        if (clientWallet.getAvailableBalance().compareTo(request.getAmount()) < 0) {
            throw new BadRequestException(String.format("Insufficient available balance. Required: %s, Available: %s",
                    request.getAmount(), clientWallet.getAvailableBalance()));
        }

        // 3. Move funds from Available to Escrow
        clientWallet.setAvailableBalance(clientWallet.getAvailableBalance().subtract(request.getAmount()));
        clientWallet.setEscrowBalance(clientWallet.getEscrowBalance().add(request.getAmount()));
        walletRepository.save(clientWallet);

        // 4. Save Escrow record
        Escrow escrow = Escrow.builder()
                .orderId(request.getOrderId())
                .clientId(request.getClientId())
                .amount(request.getAmount())
                .status(EscrowStatus.LOCKED)
                .build();
        Escrow savedEscrow = escrowRepository.save(escrow);

        // 5. Record Transaction
        WalletTransaction tx = WalletTransaction.builder()
                .walletId(clientWallet.getId())
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .transactionType(TransactionType.ESCROW_LOCK)
                .description("Escrow locked for Order #" + request.getOrderId())
                .build();
        transactionRepository.save(tx);

        return mapToResponse(savedEscrow);
    }

    @Override
    @Transactional
    public EscrowResponse releaseEscrow(ReleaseEscrowRequest request) {
        // 1. Escrow & Idempotency Check
        Escrow escrow = escrowRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Escrow", "orderId", request.getOrderId()));

        if (escrow.getStatus() == EscrowStatus.RELEASED) {
            return mapToResponse(escrow);
        }

        if (escrow.getStatus() != EscrowStatus.LOCKED) {
            throw new BadRequestException(String.format("Cannot release escrow for Order ID %d with status %s",
                    request.getOrderId(), escrow.getStatus()));
        }

        // 2. Client Wallet Deduction
        Wallet clientWallet = walletRepository.findByUserId(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", "userId", request.getClientId()));

        if (clientWallet.getEscrowBalance().compareTo(escrow.getAmount()) < 0) {
            throw new BadRequestException("Client escrow balance is less than escrow contract amount");
        }

        clientWallet.setEscrowBalance(clientWallet.getEscrowBalance().subtract(escrow.getAmount()));
        walletRepository.save(clientWallet);

        // 3. Freelancer Wallet Credit
        Wallet freelancerWallet = getOrCreateWallet(request.getFreelancerId());
        freelancerWallet.setAvailableBalance(freelancerWallet.getAvailableBalance().add(escrow.getAmount()));
        walletRepository.save(freelancerWallet);

        // 4. Update Escrow status
        escrow.setFreelancerId(request.getFreelancerId());
        escrow.setStatus(EscrowStatus.RELEASED);
        Escrow updatedEscrow = escrowRepository.save(escrow);

        // 5. Record Transactions
        WalletTransaction freelancerTx = WalletTransaction.builder()
                .walletId(freelancerWallet.getId())
                .orderId(request.getOrderId())
                .amount(escrow.getAmount())
                .transactionType(TransactionType.ESCROW_RELEASE)
                .description("Earnings released for completed Order #" + request.getOrderId())
                .build();
        transactionRepository.save(freelancerTx);

        return mapToResponse(updatedEscrow);
    }

    @Override
    @Transactional
    public EscrowResponse refundEscrow(RefundEscrowRequest request) {
        // 1. Escrow & Idempotency Check
        Escrow escrow = escrowRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Escrow", "orderId", request.getOrderId()));

        if (escrow.getStatus() == EscrowStatus.REFUNDED) {
            return mapToResponse(escrow);
        }

        if (escrow.getStatus() != EscrowStatus.LOCKED) {
            throw new BadRequestException(String.format("Cannot refund escrow for Order ID %d with status %s",
                    request.getOrderId(), escrow.getStatus()));
        }

        // 2. Client Wallet Escrow -> Available
        Wallet clientWallet = walletRepository.findByUserId(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", "userId", request.getClientId()));

        if (clientWallet.getEscrowBalance().compareTo(escrow.getAmount()) < 0) {
            throw new BadRequestException("Client escrow balance is less than escrow contract amount");
        }

        clientWallet.setEscrowBalance(clientWallet.getEscrowBalance().subtract(escrow.getAmount()));
        clientWallet.setAvailableBalance(clientWallet.getAvailableBalance().add(escrow.getAmount()));
        walletRepository.save(clientWallet);

        // 3. Update Escrow status
        escrow.setStatus(EscrowStatus.REFUNDED);
        Escrow updatedEscrow = escrowRepository.save(escrow);

        // 4. Record Transaction
        WalletTransaction clientTx = WalletTransaction.builder()
                .walletId(clientWallet.getId())
                .orderId(request.getOrderId())
                .amount(escrow.getAmount())
                .transactionType(TransactionType.ESCROW_REFUND)
                .description("Refund credited for cancelled Order #" + request.getOrderId())
                .build();
        transactionRepository.save(clientTx);

        return mapToResponse(updatedEscrow);
    }

    private Wallet getOrCreateWallet(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> walletRepository.save(Wallet.builder()
                        .userId(userId)
                        .availableBalance(BigDecimal.ZERO)
                        .escrowBalance(BigDecimal.ZERO)
                        .build()));
    }

    private EscrowResponse mapToResponse(Escrow escrow) {
        return EscrowResponse.builder()
                .id(escrow.getId())
                .orderId(escrow.getOrderId())
                .clientId(escrow.getClientId())
                .freelancerId(escrow.getFreelancerId())
                .amount(escrow.getAmount())
                .status(escrow.getStatus())
                .createdAt(escrow.getCreatedAt())
                .updatedAt(escrow.getUpdatedAt())
                .build();
    }
}
