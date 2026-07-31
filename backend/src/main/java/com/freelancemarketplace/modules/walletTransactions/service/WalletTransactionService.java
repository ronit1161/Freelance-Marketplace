package com.freelancemarketplace.modules.walletTransactions.service;

import java.util.List;

import com.freelancemarketplace.modules.walletTransactions.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;

public interface WalletTransactionService {
public WalletTransactionResponseRecord createWalletTransaction(CreateWalletTransactionRecord createWalletTransactionRecord);
	
	public List<WalletTransactionResponseRecord> getAllWalletTransactionsById(Long walletId);
}
