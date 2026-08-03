package com.freelancemarketplace.modules.admin.record;

import java.math.BigDecimal;

public record GigSummaryRecord(
		Long id,

		String title,

		BigDecimal price,

		Integer totalOrders) {
}
