package com.freelancemarketplace.modules.admin.record;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GigRecord(
		Long id,
		String title,
		String description,
		BigDecimal price,
		Integer deliveryDays,
		String thumbnailUrl,
		Integer totalOrders,
		boolean isDeleted,
		Long freelancerId,
		String freelancerName,
		Long categoryId,
		String categoryName,
		LocalDate createdOn
) {}
