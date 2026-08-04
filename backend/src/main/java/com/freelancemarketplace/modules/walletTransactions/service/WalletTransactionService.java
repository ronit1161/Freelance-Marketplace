package com.freelancemarketplace.modules.walletTransactions.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;
import com.freelancemarketplace.modules.walletTransactions.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;

public interface WalletTransactionService {

	WalletTransactionResponseRecord createWalletTransaction(CreateWalletTransactionRecord createWalletTransactionRecord);

	List<WalletTransactionResponseRecord> getAllWalletTransactionsById(Long walletId);

	Page<WalletTransactionResponseRecord> getMyWalletTransactions(Long userId, Pageable pageable);

	WalletTransactionResponseRecord getWalletTransactionById(Long transactionId, Long userId);

	Page<WalletTransactionResponseRecord> getAllWalletTransactionsAdmin(TransactionType type, TransactionStatus status, String search, Pageable pageable);

	WalletTransactionResponseRecord getWalletTransactionByIdAdmin(Long transactionId);
}
