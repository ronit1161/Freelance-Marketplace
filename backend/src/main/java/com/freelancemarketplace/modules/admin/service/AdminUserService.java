package com.freelancemarketplace.modules.admin.service;

import java.util.List;

import com.freelancemarketplace.modules.admin.record.UserDetailsRecord;
import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;

public interface AdminUserService {

    List<UserSummaryRecord> getAllUsers();

    UserDetailsRecord getUser(Long id);

    void blockUser(Long id);

    void unblockUser(Long id);
}