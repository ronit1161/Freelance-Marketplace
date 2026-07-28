package com.freelancemarketplace.modules.review.record;

public record ReviewResponseRecord(
		Long id,
		Long clientId,
		Long freelancerId,
		Long orderId,
		Integer rating,
		String comment
		) 
{}
