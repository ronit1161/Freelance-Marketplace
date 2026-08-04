package com.freelancemarketplace.modules.wallet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.wallet.record.AddMoneyRecord;
import com.freelancemarketplace.modules.wallet.record.WalletResponseRecord;
import com.freelancemarketplace.modules.wallet.service.WalletService;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.freelancemarketplace.security.CustomUserDetails;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {
	
	private final WalletService walletService;
	
    // GET /wallet/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<WalletResponseRecord>> getMyWallet(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        WalletResponseRecord wallet = walletService.getWalletByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }

    // GET /wallet?userId=1
    @GetMapping
    public ResponseEntity<ApiResponse<WalletResponseRecord>> getWallet(
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long effectiveUserId = (userId != null) ? userId : (userDetails != null ? userDetails.getId() : null);
        WalletResponseRecord wallet = walletService.getWalletByUserId(effectiveUserId);
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }
    
    // POST /wallet/add
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WalletResponseRecord>> addMoney(
            @Valid @RequestBody AddMoneyRecord dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long effectiveUserId = (userDetails != null) ? userDetails.getId() : dto.userId();
        AddMoneyRecord effectiveDto = new AddMoneyRecord(effectiveUserId, dto.amount());
        WalletResponseRecord updatedWallet = walletService.addMoney(effectiveDto);
        return ResponseEntity.ok(ApiResponse.success(updatedWallet, "Money added successfully"));
    }

    // POST /wallet/withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<WalletResponseRecord>> withdrawMoney(
            @Valid @RequestBody AddMoneyRecord dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long effectiveUserId = (userDetails != null) ? userDetails.getId() : dto.userId();
        AddMoneyRecord effectiveDto = new AddMoneyRecord(effectiveUserId, dto.amount());
        WalletResponseRecord updatedWallet = walletService.withdrawMoney(effectiveDto);
        return ResponseEntity.ok(ApiResponse.success(updatedWallet, "Money withdrawn successfully"));
    }
}
