package com.freelancemarketplace.modules.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

@Mapper(componentModel = "spring")
public interface UserMapper {
	// Record -> Entity
	@Mapping(target = "id", ignore = true) 
    @Mapping(target = "wallet", ignore = true)
	@Mapping(target = "active", ignore = true)       // Entity defaults to true
    @Mapping(target = "_blocked", ignore = true)// Service layer initializes Wallet
    @Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	@Mapping(target = "deleted",ignore = true)
	User toEntity(CreateUserRecord dto);
	
	@Mapping(target = "isActive", source = "active")        // Maps entity.isActive() -> dto.isActive()
	@Mapping(target = "walletId", source = "wallet.id")
	@Mapping(target = "isBlocked",source = "_blocked")
    UserResponseRecord toDto(User entity);
}
