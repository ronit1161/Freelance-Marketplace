package com.freelancemarketplace.modules.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.entities.User;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

@Mapper(componentModel = "spring")
public interface UserMapper {
	// Record -> Entity
	@Mapping(target = "id", ignore = true)
    @Mapping(target = "hashedPassword", ignore = true) // Ignored because Service layer will hash rawPassword
    @Mapping(target = "wallet", ignore = true)
	@Mapping(target = "active", ignore = true)       // Entity defaults to true
    @Mapping(target = "verified", ignore = true)// Service layer initializes Wallet
    @Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	User toEntity(CreateUserRecord dto);
	
	@Mapping(target = "isActive", source = "active")        // Maps entity.isActive() -> dto.isActive()
    @Mapping(target = "isVerified", source = "verified")    // Maps entity.isVerified() -> dto.isVerified()
	@Mapping(target = "walletId", source = "wallet.id")
    UserResponseRecord toDto(User entity);
}
