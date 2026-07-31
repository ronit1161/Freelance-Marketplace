package com.freelancemarketplace.modules.order.records;

import java.math.BigDecimal;


import com.freelancemarketplace.enums.OrderStatus;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.user.entity.User;

import jakarta.validation.constraints.NotBlank;



public record CreateOrderRecord(
		
		@NotBlank 
		String requirements ,
		
		
		@NotBlank 
		BigDecimal agreedPrice ,
		
		
		@NotBlank 
		OrderStatus status ,

		
		@NotBlank  
		User client,
		
		
		@NotBlank 
		User freelancer,
		
		
		@NotBlank 
		Gigs gig 
		) 


{}
