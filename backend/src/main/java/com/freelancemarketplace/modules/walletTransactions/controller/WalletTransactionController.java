package com.freelancemarketplace.modules.walletTransactions.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.walletTransactions.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;
import com.freelancemarketplace.modules.walletTransactions.service.WalletTransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallet/transactions")
@RequiredArgsConstructor
public class WalletTransactionController {
	private final WalletTransactionService walletTransactionService;
	
	@GetMapping("/{walletId}")
	public ResponseEntity<?>getAllWalletTransactions(@PathVariable Long walletId){
		
		List<WalletTransactionResponseRecord> walletResponseRecords=walletTransactionService.getAllWalletTransactionsById(walletId);
		return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponse.success(walletResponseRecords));
	}
	
	@PutMapping()
	public ResponseEntity<?> createWalletTransaction(@RequestBody CreateWalletTransactionRecord createWalletTransactionRecord){
		
		WalletTransactionResponseRecord walletTransactionResponseRecord=walletTransactionService.createWalletTransaction(createWalletTransactionRecord);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(walletTransactionResponseRecord));
		
	}
}
