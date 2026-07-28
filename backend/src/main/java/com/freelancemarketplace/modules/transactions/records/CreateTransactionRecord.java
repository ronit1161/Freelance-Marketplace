package modules.transactions.records;

import java.math.BigDecimal;

import enums.TransactionStatus;
import enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateTransactionRecord(
		@NotNull @Positive BigDecimal amount,
	    String description,
	    @NotNull TransactionType transactionType,
	    TransactionStatus transactionStatus
		) 
{}
