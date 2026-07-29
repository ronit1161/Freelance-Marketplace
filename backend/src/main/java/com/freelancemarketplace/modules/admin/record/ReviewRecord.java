package com.freelancemarketplace.modules.admin.record;

import java.time.LocalDate;

public record ReviewRecord(
		Long id,
		Long clientId,
		String clientName,
		Long freelancerId,
		String freelancerName,
		Long orderId,
		Integer rating,
		String comment,
		LocalDate createdOn
) {}
