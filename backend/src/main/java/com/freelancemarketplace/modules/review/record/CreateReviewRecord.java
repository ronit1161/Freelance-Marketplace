package com.freelancemarketplace.modules.review.record;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateReviewRecord(
		@NotBlank
		Long clientId,
		@NotBlank
		Long freelancerId,
		@NotBlank
		Long orderId,
		@NotBlank
		@Min(value = 0, message = "Rating cannot be less than 0")
	    @Max(value = 5, message = "Rating cannot be greater than 5")
		Integer rating,
		String comment
		)
{}
