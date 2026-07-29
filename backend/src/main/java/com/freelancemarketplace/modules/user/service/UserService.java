package com.freelancemarketplace.modules.user.service;

import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;

public interface UserService {
	public UserResponseRecord createUser(CreateUserRecord user);
	
	public UserResponseRecord findUserById(Long userId);
	
	public UserResponseRecord updateUserDetails(Long userId,CreateUserRecord user);
	
	public void deleteUser(Long userId);
}
