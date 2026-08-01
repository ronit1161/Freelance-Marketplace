package com.freelancemarketplace.modules.review.record;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRecord(
		@NotNull
		Long clientId,
		@NotNull
		Long freelancerId,
		@NotNull
		Long orderId,
		@NotNull
		@Min(value = 1, message = "Rating cannot be less than 0")
	    @Max(value = 5, message = "Rating cannot be greater than 5")
		Integer rating,
		String comment
		)
{}
