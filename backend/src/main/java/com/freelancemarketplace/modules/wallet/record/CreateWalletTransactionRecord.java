package modules.wallet.record;

import java.math.BigDecimal;

import enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateWalletTransactionRecord(
		
	    @NotNull(message = "Freelancer wallet ID is required")
	    Long freelancerWalletId,

	    @NotNull(message = "User wallet ID is required")
	    Long userWalletId,
	    @NotNull(message = "Amount is required")
	    @Positive(message = "Amount must be greater than zero")
	    BigDecimal amount,

	    String description,

	    @NotNull(message = "Transaction type is required")
	    TransactionType transactionType
		) 
{}
