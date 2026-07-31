package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.UserDetailsRecord;
import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;
import com.freelancemarketplace.modules.admin.repository.UserRepo;
import com.freelancemarketplace.modules.admin.service.AdminUserService;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.mapper.UserMapperAdmin;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepo userRepo;
    private final UserMapperAdmin userMapperAdmin;

    @Override
    public List<UserSummaryRecord> getAllUsers() {
        List<User> users = userRepo.findAll();
        return userMapperAdmin.toSummaryList(users);
    }

    @Override
    public UserDetailsRecord getUser(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'getUser'");
    }

    @Override
    public void blockUser(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'blockUser'");
    }

    @Override
    public void unblockUser(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'unblockUser'");
    }
}