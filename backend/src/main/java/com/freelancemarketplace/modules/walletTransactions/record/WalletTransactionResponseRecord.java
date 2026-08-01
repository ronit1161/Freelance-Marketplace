package com.freelancemarketplace.modules.walletTransactions.record;

import java.time.LocalDateTime;

import com.freelancemarketplace.modules.transactions.records.TransactionResponseRecord;

public record WalletTransactionResponseRecord(
		Long id,
	    TransactionResponseRecord transaction,
	    Long sourceWalletId,
	    Long destinationWalletId,
	    LocalDateTime createdOn
		) 
{}
