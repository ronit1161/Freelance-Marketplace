package com.freelancemarketplace.modules.user.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserSummaryRecord toSummary(User user);

    List<UserSummaryRecord> toSummaryList(List<User> users);

}
