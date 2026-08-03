package com.freelancemarketplace.modules.user.mapper;

import java.util.List;
import java.util.Optional;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.admin.record.UserDetailsRecord;
import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
	@Mapping(target = "id", ignore = true) 
    @Mapping(target = "wallet", ignore = true)
	@Mapping(target = "active", ignore = true)
    @Mapping(target = "_blocked", ignore = true)
    @Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	@Mapping(target = "deleted",ignore = true)
	User toEntity(CreateUserRecord dto);
	
	@Mapping(target = "isActive", source = "active")
	@Mapping(target = "walletId", source = "wallet.id")
	@Mapping(target = "isBlocked",source = "_blocked")
    UserResponseRecord toDto(User entity);

    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "isBlocked", source = "_blocked")
    UserSummaryRecord toSummary(User user);

    List<UserSummaryRecord> toSummaryList(List<User> users);

    @Mapping(target = "isBlocked", source = "_blocked")
    UserDetailsRecord toDetails(User user);

    default UserDetailsRecord toDetailRecord(Optional<User> user) {
        return user.map(this::toDetails).orElse(null);
    }
}
