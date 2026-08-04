package com.freelancemarketplace.modules.order.records;

import java.math.BigDecimal;

import com.freelancemarketplace.enums.OrderStatus;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.user.entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOrderRecord(
		@NotBlank 
		String requirements,
		
		@NotNull @Positive
		BigDecimal agreedPrice,
		
		@NotNull 
		OrderStatus status,

		@NotNull  
		User client,
		
		@NotNull 
		User freelancer,
		
		@NotNull 
		Gigs gig 
) {}
