package com.freelancemarketplace.modules.walletTransactions.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;
import com.freelancemarketplace.modules.walletTransactions.service.WalletTransactionService;
import com.freelancemarketplace.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallet/transactions")
@RequiredArgsConstructor
public class WalletTransactionController {

	private final WalletTransactionService walletTransactionService;

	/**
	 * 1. Get My Wallet Transactions
	 * GET /wallet/transactions
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<Page<WalletTransactionResponseRecord>>> getMyWalletTransactions(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id,desc") String[] sort) {

		Sort sortObj = parseSort(sort);
		Pageable pageable = PageRequest.of(page, size, sortObj);

		Page<WalletTransactionResponseRecord> transactions = walletTransactionService.getMyWalletTransactions(
				userDetails.getId(), pageable);

		return ResponseEntity.ok(ApiResponse.success(transactions));
	}

	/**
	 * 2. Get Wallet Transaction By ID
	 * GET /wallet/transactions/{transactionId}
	 */
	@GetMapping("/{transactionId}")
	public ResponseEntity<ApiResponse<WalletTransactionResponseRecord>> getWalletTransactionById(
			@PathVariable Long transactionId,
			@AuthenticationPrincipal CustomUserDetails userDetails) {

		WalletTransactionResponseRecord transaction = walletTransactionService.getWalletTransactionById(
				transactionId, userDetails.getId());

		return ResponseEntity.ok(ApiResponse.success(transaction));
	}

	private Sort parseSort(String[] sort) {
		if (sort == null || sort.length == 0) {
			return Sort.by(Sort.Direction.DESC, "id");
		}
		if (sort.length == 2 && ("asc".equalsIgnoreCase(sort[1]) || "desc".equalsIgnoreCase(sort[1]))) {
			Sort.Direction direction = Sort.Direction.fromString(sort[1]);
			return Sort.by(direction, sort[0]);
		}
		Sort.Order[] orders = new Sort.Order[sort.length];
		for (int i = 0; i < sort.length; i++) {
			String[] parts = sort[i].split(",");
			if (parts.length == 2) {
				orders[i] = new Sort.Order(Sort.Direction.fromString(parts[1]), parts[0]);
			} else {
				orders[i] = Sort.Order.desc(parts[0]);
			}
		}
		return Sort.by(orders);
	}
}
