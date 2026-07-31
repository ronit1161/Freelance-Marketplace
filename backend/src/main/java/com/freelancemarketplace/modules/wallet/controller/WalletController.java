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
import com.freelancemarketplace.modules.wallet.record.WalletTransactionResponse;
import com.freelancemarketplace.modules.wallet.service.WalletService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {
	
	private final WalletService walletService;
	
    // GET /wallet?userId=1
    @GetMapping
    public ResponseEntity<ApiResponse<WalletResponseRecord>> getWallet(
            @RequestParam Long userId) {
        WalletResponseRecord wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }
    
    // GET /wallet/transactions?userId=1
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<WalletTransactionResponse>>> getWalletTransactions(
            @RequestParam Long userId) {
        List<WalletTransactionResponse> transactions = walletService.getWalletTransactions(userId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
    
    // POST /wallet/add
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WalletResponseRecord>> addMoney(
            @Valid @RequestBody AddMoneyRecord dto) {
        WalletResponseRecord updatedWallet = walletService.addMoney(dto);
        return ResponseEntity.ok(ApiResponse.success(updatedWallet, "Money added successfully"));
    }

}
