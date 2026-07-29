package com.freelancemarketplace.modules.admin.record;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.freelancemarketplace.enums.OrderStatus;

public record OrderRecord(
		Long id,
		String requirements,
		BigDecimal agreedPrice,
		OrderStatus status,
		Long clientId,
		String clientName,
		Long freelancerId,
		String freelancerName,
		Long gigId,
		String gigTitle,
		LocalDate createdOn,
		LocalDateTime lastUpdated
) {}
