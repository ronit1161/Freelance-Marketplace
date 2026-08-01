package com.freelancemarketplace.modules.gigs.records;

import java.math.BigDecimal;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateGigRecord( 

	    @NotBlank 
		String title,

	    @NotBlank 
		String description,

	    @NotNull 
		@Positive 
		BigDecimal price,

	    @NotNull 
		@Positive 
		Integer deliveryDays,

	    @NotBlank 
		String thumbnailUrl,

	    @NotNull 
		Long freelancerId,

	    @NotNull 
		Long categoryId
	) {}