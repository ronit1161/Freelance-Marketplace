package com.freelancemarketplace.modules.user.service;

import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

import com.freelancemarketplace.modules.user.record.UpdateProfileRecord;

public interface UserService {
	public UserResponseRecord createUser(CreateUserRecord user);
	
	public UserResponseRecord findUserById(Long userId);
	
	public UserResponseRecord updateUserDetails(Long userId, CreateUserRecord user);

	public UserResponseRecord updateProfile(Long userId, UpdateProfileRecord dto);
	
	public void deleteUser(Long userId);
}
