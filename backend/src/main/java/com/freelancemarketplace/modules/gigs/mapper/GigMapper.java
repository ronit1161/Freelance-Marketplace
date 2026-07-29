package com.freelancemarketplace.modules.gigs.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.gigs.entity.Gigs;
import com.freelancemarketplace.modules.gigs.records.CreateGigRecord;
import com.freelancemarketplace.modules.gigs.records.GigResponseRecord;

@Mapper(componentModel = "spring")
public interface GigMapper 
{
	@Mapping(target = "id" , ignore = true)
	@Mapping(target = "createdOn" , ignore = true)
	@Mapping(target = "lastUpdated" , ignore = true)
	@Mapping (target = "totalOrders" , ignore = true)
	@Mapping (target = "deleted" , ignore = true)
	Gigs toEntity(CreateGigRecord dto);
	
	@Mapping(target = "isDeleted" , ignore = true)
	@Mapping(target = "freelancerId" , source = "freelancer.id" )
	GigResponseRecord toDto(Gigs entity); 
}
