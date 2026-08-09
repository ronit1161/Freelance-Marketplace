package com.freelancemarketplace.walletservice.service;

import com.freelancemarketplace.shared.exception.BadRequestException;
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
import com.freelancemarketplace.walletservice.service.impl.EscrowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EscrowServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private EscrowRepository escrowRepository;

    @Mock
    private WalletTransactionRepository transactionRepository;

    @InjectMocks
    private EscrowServiceImpl escrowService;

    private Wallet clientWallet;
    private Wallet freelancerWallet;
    private Escrow sampleEscrow;

    @BeforeEach
    void setUp() {
        clientWallet = Wallet.builder()
                .id(1L)
                .userId(100L)
                .availableBalance(BigDecimal.valueOf(1000.00))
                .escrowBalance(BigDecimal.valueOf(0.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        freelancerWallet = Wallet.builder()
                .id(2L)
                .userId(200L)
                .availableBalance(BigDecimal.valueOf(0.00))
                .escrowBalance(BigDecimal.valueOf(0.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleEscrow = Escrow.builder()
                .id(10L)
                .orderId(1L)
                .clientId(100L)
                .freelancerId(200L)
                .amount(BigDecimal.valueOf(500.00))
                .status(EscrowStatus.LOCKED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should successfully lock funds in escrow when balance is sufficient")
    void lockEscrow_Success() {
        LockEscrowRequest request = LockEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.empty());
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(clientWallet));
        when(escrowRepository.save(any(Escrow.class))).thenAnswer(i -> {
            Escrow e = i.getArgument(0);
            e.setId(10L);
            return e;
        });

        EscrowResponse response = escrowService.lockEscrow(request);

        assertThat(response).isNotNull();
        assertThat(response.getOrderId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo(EscrowStatus.LOCKED);
        assertThat(clientWallet.getAvailableBalance()).isEqualTo(BigDecimal.valueOf(500.00));
        assertThat(clientWallet.getEscrowBalance()).isEqualTo(BigDecimal.valueOf(500.00));

        verify(walletRepository).save(clientWallet);
        verify(transactionRepository).save(any(WalletTransaction.class));
    }

    @Test
    @DisplayName("Lock escrow should fail when client has insufficient available balance")
    void lockEscrow_InsufficientFunds_ThrowsException() {
        clientWallet.setAvailableBalance(BigDecimal.valueOf(200.00)); // Only 200 available

        LockEscrowRequest request = LockEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.empty());
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(clientWallet));

        assertThatThrownBy(() -> escrowService.lockEscrow(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Insufficient available balance");

        verify(escrowRepository, never()).save(any());
    }

    @Test
    @DisplayName("Lock escrow should be idempotent if order is already locked")
    void lockEscrow_Idempotent_Success() {
        LockEscrowRequest request = LockEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.of(sampleEscrow));

        EscrowResponse response = escrowService.lockEscrow(request);

        assertThat(response).isNotNull();
        assertThat(response.getOrderId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo(EscrowStatus.LOCKED);
        verify(walletRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully release escrow funds to freelancer on order completion")
    void releaseEscrow_Success() {
        clientWallet.setAvailableBalance(BigDecimal.valueOf(500.00));
        clientWallet.setEscrowBalance(BigDecimal.valueOf(500.00));

        ReleaseEscrowRequest request = ReleaseEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .freelancerId(200L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.of(sampleEscrow));
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(clientWallet));
        when(walletRepository.findByUserId(200L)).thenReturn(Optional.of(freelancerWallet));
        when(escrowRepository.save(any(Escrow.class))).thenAnswer(i -> i.getArgument(0));

        EscrowResponse response = escrowService.releaseEscrow(request);

        assertThat(response).isNotNull();
        assertThat(sampleEscrow.getStatus()).isEqualTo(EscrowStatus.RELEASED);
        assertThat(clientWallet.getEscrowBalance()).isEqualTo(BigDecimal.valueOf(0.00));
        assertThat(freelancerWallet.getAvailableBalance()).isEqualTo(BigDecimal.valueOf(500.00));

        verify(walletRepository).save(clientWallet);
        verify(walletRepository).save(freelancerWallet);
        verify(transactionRepository).save(any(WalletTransaction.class));
    }

    @Test
    @DisplayName("Release escrow should be idempotent if order was already released")
    void releaseEscrow_Idempotent_Success() {
        sampleEscrow.setStatus(EscrowStatus.RELEASED);

        ReleaseEscrowRequest request = ReleaseEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .freelancerId(200L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.of(sampleEscrow));

        EscrowResponse response = escrowService.releaseEscrow(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(EscrowStatus.RELEASED);
        verify(walletRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully refund escrow funds back to client on order cancellation")
    void refundEscrow_Success() {
        clientWallet.setAvailableBalance(BigDecimal.valueOf(500.00));
        clientWallet.setEscrowBalance(BigDecimal.valueOf(500.00));

        RefundEscrowRequest request = RefundEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.of(sampleEscrow));
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(clientWallet));
        when(escrowRepository.save(any(Escrow.class))).thenAnswer(i -> i.getArgument(0));

        EscrowResponse response = escrowService.refundEscrow(request);

        assertThat(response).isNotNull();
        assertThat(sampleEscrow.getStatus()).isEqualTo(EscrowStatus.REFUNDED);
        assertThat(clientWallet.getEscrowBalance()).isEqualTo(BigDecimal.valueOf(0.00));
        assertThat(clientWallet.getAvailableBalance()).isEqualTo(BigDecimal.valueOf(1000.00));

        verify(walletRepository).save(clientWallet);
        verify(transactionRepository).save(any(WalletTransaction.class));
    }

    @Test
    @DisplayName("Refund escrow should be idempotent if order was already refunded")
    void refundEscrow_Idempotent_Success() {
        sampleEscrow.setStatus(EscrowStatus.REFUNDED);

        RefundEscrowRequest request = RefundEscrowRequest.builder()
                .orderId(1L)
                .clientId(100L)
                .amount(BigDecimal.valueOf(500.00))
                .build();

        when(escrowRepository.findByOrderId(1L)).thenReturn(Optional.of(sampleEscrow));

        EscrowResponse response = escrowService.refundEscrow(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(EscrowStatus.REFUNDED);
        verify(walletRepository, never()).save(any());
    }
}
