package com.freelancemarketplace.modules.gigs.records;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.freelancemarketplace.modules.category.entity.Category;







public record GigResponseRecord(
		
		 Long id,
		
		LocalDate createdOn,
		
		LocalDateTime lastUpdated,
		
		
		 String title ,
		
		 String description ,
		
		
		 BigDecimal price ,
		
		
		 Integer deliveryDays ,
		
		
		 String thumbnailUrl ,
		
		
		 Integer totalOrders ,
		
		
		 boolean isDeleted ,
		
		
		  Long freelancerId ,
		
		
		 Category category 
		
		
		) {}
