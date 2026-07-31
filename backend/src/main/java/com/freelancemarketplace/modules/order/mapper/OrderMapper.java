package com.freelancemarketplace.modules.order.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.order.entity.Order;
import com.freelancemarketplace.modules.order.records.OrderResponseRecord;

@Mapper(componentModel = "spring")
public interface OrderMapper {

	@Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.fullName", target = "clientName")
    @Mapping(source = "freelancer.id", target = "freelancerId")
    @Mapping(source = "freelancer.fullName", target = "freelancerName")
    @Mapping(source = "gig.id", target = "gigId")
    @Mapping(source = "gig.title", target = "gigTitle")
    @Mapping(source = "gig.thumbnailUrl", target = "gigThumbnailUrl")
    OrderResponseRecord toDto(Order order);
    List<OrderResponseRecord> toDtoList(List<Order> orders);
}
