package com.freelancemarketplace.modules.walletTransactions.record;

import com.freelancemarketplace.modules.transactions.records.CreateTransactionRecord;

public record CreateWalletTransactionRecord(
		
	    Long sourceWalletId,
	    Long destinationWalletId,
	    CreateTransactionRecord createTransactionRecord
		) 
{}
