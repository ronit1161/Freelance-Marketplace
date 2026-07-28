package com.freelancemarketplace.modules.gigs.records;

import java.math.BigDecimal;

import com.freelancemarketplace.modules.catagory.entity.Category;
import com.freelancemarketplace.modules.user.entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateGigRecord( 

	
	@NotNull String title ,
	
	
	@NotBlank String description ,
	
	
	@NotBlank @Positive BigDecimal price ,
	
	
	@NotBlank Integer deliveryDays , 
	
	
	 @NotNull String thumbnailUrl ,
	
	
	@NotBlank User freelancer ,
	
	@NotBlank Category category 
) {}
