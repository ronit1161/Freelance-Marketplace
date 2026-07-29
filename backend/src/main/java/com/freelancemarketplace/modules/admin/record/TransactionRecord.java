package com.freelancemarketplace.modules.admin.record;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;

public record TransactionRecord(
		Long id,
		BigDecimal amount,
		String description,
		TransactionType transactionType,
		TransactionStatus transactionStatus,
		LocalDate createdOn,
		LocalDateTime lastUpdated
) {}
