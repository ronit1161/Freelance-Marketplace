package com.freelancemarketplace.walletservice.controller;

import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.walletservice.dto.request.DepositRequest;
import com.freelancemarketplace.walletservice.dto.request.LockEscrowRequest;
import com.freelancemarketplace.walletservice.dto.request.RefundEscrowRequest;
import com.freelancemarketplace.walletservice.dto.request.ReleaseEscrowRequest;
import com.freelancemarketplace.walletservice.dto.response.EscrowResponse;
import com.freelancemarketplace.walletservice.dto.response.WalletResponse;
import com.freelancemarketplace.walletservice.dto.response.WalletTransactionResponse;
import com.freelancemarketplace.walletservice.service.EscrowService;
import com.freelancemarketplace.walletservice.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final EscrowService escrowService;

    @GetMapping(value = {"", "/me"})
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet(
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId
    ) {
        log.info("Received request to fetch wallet for User ID {}", authenticatedUserId);
        WalletResponse response = walletService.getOrCreateWallet(authenticatedUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<WalletResponse>> getWalletByUserId(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to fetch wallet for Target User ID {} by User ID {}", userId, authenticatedUserId);
        WalletResponse response = walletService.getWalletByUserId(userId, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping(value = {"/deposit", "/add"})
    public ResponseEntity<ApiResponse<WalletResponse>> deposit(
            @Valid @RequestBody DepositRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId
    ) {
        log.info("Received deposit request of {} for User ID {}", request.getAmount(), authenticatedUserId);
        WalletResponse response = walletService.deposit(authenticatedUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", response));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<WalletTransactionResponse>>> getTransactions(
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId
    ) {
        log.info("Received request to fetch transactions for User ID {}", authenticatedUserId);
        List<WalletTransactionResponse> response = walletService.getTransactionsByUserId(authenticatedUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/escrow/lock")
    public ResponseEntity<ApiResponse<EscrowResponse>> lockEscrow(
            @Valid @RequestBody LockEscrowRequest request
    ) {
        log.info("Received escrow lock request for Order ID: {}, Client ID: {}, Amount: {}",
                request.getOrderId(), request.getClientId(), request.getAmount());
        EscrowResponse response = escrowService.lockEscrow(request);
        return ResponseEntity.ok(ApiResponse.success("Escrow locked successfully", response));
    }

    @PostMapping("/escrow/release")
    public ResponseEntity<ApiResponse<EscrowResponse>> releaseEscrow(
            @Valid @RequestBody ReleaseEscrowRequest request
    ) {
        log.info("Received escrow release request for Order ID: {}, Freelancer ID: {}",
                request.getOrderId(), request.getFreelancerId());
        EscrowResponse response = escrowService.releaseEscrow(request);
        return ResponseEntity.ok(ApiResponse.success("Escrow released successfully", response));
    }

    @PostMapping("/escrow/refund")
    public ResponseEntity<ApiResponse<EscrowResponse>> refundEscrow(
            @Valid @RequestBody RefundEscrowRequest request
    ) {
        log.info("Received escrow refund request for Order ID: {}, Client ID: {}",
                request.getOrderId(), request.getClientId());
        EscrowResponse response = escrowService.refundEscrow(request);
        return ResponseEntity.ok(ApiResponse.success("Escrow refunded successfully", response));
    }
}
