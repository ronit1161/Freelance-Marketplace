package com.freelancemarketplace.walletservice.service;

import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.walletservice.dto.request.DepositRequest;
import com.freelancemarketplace.walletservice.dto.response.WalletResponse;
import com.freelancemarketplace.walletservice.dto.response.WalletTransactionResponse;
import com.freelancemarketplace.walletservice.entity.TransactionType;
import com.freelancemarketplace.walletservice.entity.Wallet;
import com.freelancemarketplace.walletservice.entity.WalletTransaction;
import com.freelancemarketplace.walletservice.repository.WalletRepository;
import com.freelancemarketplace.walletservice.repository.WalletTransactionRepository;
import com.freelancemarketplace.walletservice.service.impl.WalletServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private WalletTransactionRepository transactionRepository;

    @InjectMocks
    private WalletServiceImpl walletService;

    private Wallet sampleWallet;

    @BeforeEach
    void setUp() {
        sampleWallet = Wallet.builder()
                .id(1L)
                .userId(100L)
                .availableBalance(BigDecimal.valueOf(1000.00))
                .escrowBalance(BigDecimal.valueOf(0.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should successfully auto-initialize or retrieve wallet")
    void getOrCreateWallet_Success() {
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(sampleWallet));

        WalletResponse response = walletService.getOrCreateWallet(100L);

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(100L);
        assertThat(response.getAvailableBalance()).isEqualTo(BigDecimal.valueOf(1000.00));
        assertThat(response.getTotalBalance()).isEqualTo(BigDecimal.valueOf(1000.00));
    }

    @Test
    @DisplayName("User should successfully view their own wallet")
    void getWalletByUserId_Self_Success() {
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(sampleWallet));

        WalletResponse response = walletService.getWalletByUserId(100L, 100L, "ROLE_CLIENT");

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Admin should successfully view any user's wallet")
    void getWalletByUserId_Admin_Success() {
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(sampleWallet));

        WalletResponse response = walletService.getWalletByUserId(100L, 999L, "ROLE_ADMIN");

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("User should be forbidden from viewing another user's wallet")
    void getWalletByUserId_Unauthorized_ThrowsForbiddenException() {
        assertThatThrownBy(() -> walletService.getWalletByUserId(100L, 200L, "ROLE_CLIENT"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("You do not have permission to view this wallet");
    }

    @Test
    @DisplayName("User should successfully deposit money into wallet")
    void deposit_Success() {
        DepositRequest request = DepositRequest.builder()
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(sampleWallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(i -> i.getArgument(0));

        WalletResponse response = walletService.deposit(100L, request);

        assertThat(response).isNotNull();
        assertThat(sampleWallet.getAvailableBalance()).isEqualTo(BigDecimal.valueOf(1500.00));
        verify(transactionRepository).save(any(WalletTransaction.class));
    }

    @Test
    @DisplayName("Should retrieve wallet transaction history")
    void getTransactionsByUserId_Success() {
        WalletTransaction tx = WalletTransaction.builder()
                .id(1L)
                .walletId(1L)
                .amount(BigDecimal.valueOf(500.00))
                .transactionType(TransactionType.DEPOSIT)
                .description("Funds deposited: +500.00")
                .createdAt(LocalDateTime.now())
                .build();

        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(sampleWallet));
        when(transactionRepository.findByWalletIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(tx));

        List<WalletTransactionResponse> transactions = walletService.getTransactionsByUserId(100L);

        assertThat(transactions).hasSize(1);
        assertThat(transactions.get(0).getTransactionType()).isEqualTo(TransactionType.DEPOSIT);
    }
}
