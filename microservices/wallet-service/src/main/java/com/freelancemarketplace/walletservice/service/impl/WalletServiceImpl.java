package com.freelancemarketplace.walletservice.service.impl;

import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.UnauthorizedException;
import com.freelancemarketplace.walletservice.dto.request.DepositRequest;
import com.freelancemarketplace.walletservice.dto.response.WalletResponse;
import com.freelancemarketplace.walletservice.dto.response.WalletTransactionResponse;
import com.freelancemarketplace.walletservice.entity.TransactionType;
import com.freelancemarketplace.walletservice.entity.Wallet;
import com.freelancemarketplace.walletservice.entity.WalletTransaction;
import com.freelancemarketplace.walletservice.repository.WalletRepository;
import com.freelancemarketplace.walletservice.repository.WalletTransactionRepository;
import com.freelancemarketplace.walletservice.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    @Override
    @Transactional
    public WalletResponse getOrCreateWallet(Long userId) {
        enforceAuthentication(userId);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Creating new wallet for User ID: {}", userId);
                    return walletRepository.save(Wallet.builder()
                            .userId(userId)
                            .availableBalance(BigDecimal.ZERO)
                            .escrowBalance(BigDecimal.ZERO)
                            .build());
                });

        return mapToResponse(wallet);
    }

    @Override
    @Transactional(readOnly = true)
    public WalletResponse getWalletByUserId(Long targetUserId, Long authenticatedUserId, String userRole) {
        enforceAuthentication(authenticatedUserId);

        boolean isSelf = targetUserId.equals(authenticatedUserId);
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole);

        if (!isSelf && !isAdmin) {
            log.warn("Access denied: User ID {} tried to view wallet of User ID {}", authenticatedUserId, targetUserId);
            throw new ForbiddenException("You do not have permission to view this wallet");
        }

        Wallet wallet = walletRepository.findByUserId(targetUserId)
                .orElseGet(() -> {
                    log.info("Auto-initializing wallet for User ID: {}", targetUserId);
                    return walletRepository.save(Wallet.builder()
                            .userId(targetUserId)
                            .availableBalance(BigDecimal.ZERO)
                            .escrowBalance(BigDecimal.ZERO)
                            .build());
                });

        return mapToResponse(wallet);
    }

    @Override
    @Transactional
    public WalletResponse deposit(Long userId, DepositRequest request) {
        enforceAuthentication(userId);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> walletRepository.save(Wallet.builder()
                        .userId(userId)
                        .availableBalance(BigDecimal.ZERO)
                        .escrowBalance(BigDecimal.ZERO)
                        .build()));

        BigDecimal depositAmount = request.getAmount();
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(depositAmount));
        Wallet updatedWallet = walletRepository.save(wallet);

        // Record DEPOSIT transaction
        WalletTransaction tx = WalletTransaction.builder()
                .walletId(updatedWallet.getId())
                .amount(depositAmount)
                .transactionType(TransactionType.DEPOSIT)
                .description("Funds deposited: +" + depositAmount)
                .build();
        transactionRepository.save(tx);

        log.info("User ID {} deposited {}. New available balance: {}", userId, depositAmount, updatedWallet.getAvailableBalance());
        return mapToResponse(updatedWallet);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WalletTransactionResponse> getTransactionsByUserId(Long userId) {
        enforceAuthentication(userId);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> walletRepository.save(Wallet.builder()
                        .userId(userId)
                        .availableBalance(BigDecimal.ZERO)
                        .escrowBalance(BigDecimal.ZERO)
                        .build()));

        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()).stream()
                .map(this::mapToTxResponse)
                .toList();
    }

    private void enforceAuthentication(Long userId) {
        if (userId == null) {
            throw new UnauthorizedException("Authentication is required to perform this action");
        }
    }

    private WalletResponse mapToResponse(Wallet wallet) {
        return WalletResponse.builder()
                .id(wallet.getId())
                .userId(wallet.getUserId())
                .availableBalance(wallet.getAvailableBalance())
                .escrowBalance(wallet.getEscrowBalance())
                .totalBalance(wallet.getTotalBalance())
                .createdAt(wallet.getCreatedAt())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }

    private WalletTransactionResponse mapToTxResponse(WalletTransaction tx) {
        return WalletTransactionResponse.builder()
                .id(tx.getId())
                .walletId(tx.getWalletId())
                .orderId(tx.getOrderId())
                .amount(tx.getAmount())
                .transactionType(tx.getTransactionType())
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
