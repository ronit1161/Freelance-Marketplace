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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final EscrowService escrowService;

    @GetMapping(value = {"", "/me"})
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet(
            @RequestHeader("X-User-Id") Long authenticatedUserId
    ) {
        WalletResponse response = walletService.getOrCreateWallet(authenticatedUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<WalletResponse>> getWalletByUserId(
            @PathVariable Long userId,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        WalletResponse response = walletService.getWalletByUserId(userId, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping(value = {"/deposit", "/add"})
    public ResponseEntity<ApiResponse<WalletResponse>> deposit(
            @Valid @RequestBody DepositRequest request,
            @RequestHeader("X-User-Id") Long authenticatedUserId
    ) {
        WalletResponse response = walletService.deposit(authenticatedUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", response));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<WalletTransactionResponse>>> getTransactions(
            @RequestHeader("X-User-Id") Long authenticatedUserId
    ) {
        List<WalletTransactionResponse> response = walletService.getTransactionsByUserId(authenticatedUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/escrow/lock")
    public ResponseEntity<ApiResponse<EscrowResponse>> lockEscrow(
            @Valid @RequestBody LockEscrowRequest request
    ) {
        EscrowResponse response = escrowService.lockEscrow(request);
        return ResponseEntity.ok(ApiResponse.success("Escrow locked successfully", response));
    }

    @PostMapping("/escrow/release")
    public ResponseEntity<ApiResponse<EscrowResponse>> releaseEscrow(
            @Valid @RequestBody ReleaseEscrowRequest request
    ) {
        EscrowResponse response = escrowService.releaseEscrow(request);
        return ResponseEntity.ok(ApiResponse.success("Escrow released successfully", response));
    }

    @PostMapping("/escrow/refund")
    public ResponseEntity<ApiResponse<EscrowResponse>> refundEscrow(
            @Valid @RequestBody RefundEscrowRequest request
    ) {
        EscrowResponse response = escrowService.refundEscrow(request);
        return ResponseEntity.ok(ApiResponse.success("Escrow refunded successfully", response));
    }
}
