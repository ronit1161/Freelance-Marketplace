package com.freelancemarketplace.modules.order.records;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.freelancemarketplace.enums.OrderStatus;

public record OrderResponseRecord(
		Long id,
		String requirements,
		BigDecimal agreedPrice,
		OrderStatus status,
	    Long clientId,
	    String clientName,
	    Long freelancerId,
	    String freelancerName,
	    Long gigId,
	    String gigTitle,
	    String gigThumbnailUrl,
	    LocalDate createdOn,
	    LocalDateTime lastUpdated
		
		) {

}
