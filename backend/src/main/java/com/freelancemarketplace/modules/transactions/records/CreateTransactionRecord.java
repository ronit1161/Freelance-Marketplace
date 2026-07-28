package com.freelancemarketplace.modules.transactions.records;

import java.math.BigDecimal;

import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateTransactionRecord(
		@NotNull @Positive BigDecimal amount,
	    String description,
	    @NotNull TransactionType transactionType,
	    TransactionStatus transactionStatus
		) 
{}
