package com.freelancemarketplace.modules.review.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.review.entity.Review;
import com.freelancemarketplace.modules.review.record.ReviewResponseRecord;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

	@Mapping(target = "clientId",source="client.id")
	@Mapping(target = "freelancerId",source="freelancer.id")
	@Mapping(target = "orderId",source="order.id")
	ReviewResponseRecord toDto(Review entity);
	
}