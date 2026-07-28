package modules.wallet.record;

import java.time.LocalDateTime;

import modules.transactions.records.TransactionResponseRecord;

public record WalletTransactionResponse(
		Long id,
	    TransactionResponseRecord transaction,
	    WalletResponseRecord clientWallet,
	    WalletResponseRecord freelancerWallet,
	    LocalDateTime createdAt
		) 
{}
