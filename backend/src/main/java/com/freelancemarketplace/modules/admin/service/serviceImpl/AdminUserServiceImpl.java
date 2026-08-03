package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.UserDetailsRecord;
import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;
import com.freelancemarketplace.modules.admin.service.AdminUserService;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.mapper.UserMapper;
import com.freelancemarketplace.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    @Override
    public List<UserSummaryRecord> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toSummaryList(users);

    }

    @Override
    public UserDetailsRecord getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toDetails(user);
    }

    @Override
    public void blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.set_blocked(true);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.set_blocked(false);
        userRepository.save(user);
    }
}
