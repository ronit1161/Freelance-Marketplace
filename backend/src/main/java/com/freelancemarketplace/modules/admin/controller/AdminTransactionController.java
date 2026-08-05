package com.freelancemarketplace.modules.admin.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;
import com.freelancemarketplace.modules.walletTransactions.service.WalletTransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/wallet-transactions")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminTransactionController {

	private final WalletTransactionService walletTransactionService;

	/**
	 * 3. Admin - View All Wallet Transactions
	 * GET /admin/wallet-transactions
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<Page<WalletTransactionResponseRecord>>> getAllWalletTransactions(
			@RequestParam(required = false) TransactionType type,
			@RequestParam(required = false) TransactionStatus status,
			@RequestParam(required = false) String search,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id,desc") String[] sort) {

		Sort sortObj = parseSort(sort);
		Pageable pageable = PageRequest.of(page, size, sortObj);

		Page<WalletTransactionResponseRecord> transactions = walletTransactionService.getAllWalletTransactionsAdmin(
				type, status, search, pageable);

		return ResponseEntity.ok(ApiResponse.success(transactions));
	}

	/**
	 * 4. Admin - Transaction Details
	 * GET /admin/wallet-transactions/{id}
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<WalletTransactionResponseRecord>> getTransactionById(
			@PathVariable Long id) {

		WalletTransactionResponseRecord transaction = walletTransactionService.getWalletTransactionByIdAdmin(id);

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
