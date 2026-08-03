package com.freelancemarketplace.modules.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
	@Mapping(target = "id", ignore = true) 
    @Mapping(target = "wallet", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "blocked", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "lastUpdated", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    User toEntity(CreateUserRecord dto);
    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "walletId", source = "wallet.id")
    @Mapping(target = "isBlocked", source = "blocked")
    UserResponseRecord toDto(User entity);
}
