package com.freelancemarketplace.modules.admin.record;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GigSummaryRecord(
		Long id,

		String title,

		String description,

		BigDecimal price,

		Integer deliveryDays,

		Integer totalOrders,

		String freelancerName,

		String categoryName
) {
}
