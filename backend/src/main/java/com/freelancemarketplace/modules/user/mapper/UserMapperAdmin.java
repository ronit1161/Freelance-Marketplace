package com.freelancemarketplace.modules.user.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.admin.record.UserDetailsRecord;
import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;
import com.freelancemarketplace.modules.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapperAdmin {

    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "isBlocked", source = "_blocked")
    UserSummaryRecord toSummary(User user);

    List<UserSummaryRecord> toSummaryList(List<User> users);

    @Mapping(target = "isBlocked", source = "_blocked")
    UserDetailsRecord toDetails(User user);
}
