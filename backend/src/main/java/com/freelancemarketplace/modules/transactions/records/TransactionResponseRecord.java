package modules.transactions.records;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import enums.TransactionStatus;
import enums.TransactionType;

public record TransactionResponseRecord(
		Long id,
	    BigDecimal amount,
	    String description,
	    TransactionType transactionType,
	    TransactionStatus transactionStatus,
	    LocalDateTime createdOn
		) 
{}
