package com.freelancemarketplace.modules.transactions.records;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;

public record TransactionResponseRecord(
		Long id,
	    BigDecimal amount,
	    String description,
	    TransactionType transactionType,
	    TransactionStatus transactionStatus,
	    LocalDateTime createdOn
		) 
{}
