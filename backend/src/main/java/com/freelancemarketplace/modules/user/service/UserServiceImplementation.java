package com.freelancemarketplace.modules.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.mapper.UserMapper;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.record.UserResponseRecord;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.modules.wallet.entity.Wallet;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional
public class UserServiceImplementation implements UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;
	@Override
	@Transactional
	public UserResponseRecord createUser(CreateUserRecord user) {
		User userEntity=userMapper.toEntity(user);
		userEntity.setWallet(new Wallet());
		userRepository.save(userEntity);
		return userMapper.toDto(userEntity);
	}
	@Override
	@Transactional(readOnly = true)
	public UserResponseRecord findUserById(Long userId) {
		return userRepository.findById(userId)
                .map(userMapper::toDto).orElseThrow(()->new RuntimeException());
    }
	@Override
	@Transactional
	public UserResponseRecord updateUserDetails(Long userId, CreateUserRecord user) {
		
		User existingUser=userRepository.findById(userId).
				orElseThrow(()->new RuntimeException());
		existingUser.setBioData(user.bioData());
		existingUser.setEmail(user.email());
		existingUser.setUserName(user.userName());
		
		User updatedUser=userRepository.save(existingUser);
		return userMapper.toDto(updatedUser);
	}
	@Override
	@Transactional(readOnly = true)
	public void deleteUser(Long userId) {
		User existingUser=userRepository.findById(userId).
				orElseThrow(()->new RuntimeException());
		existingUser.setDeleted(true);
		userRepository.save(existingUser);
	}
	
	
	
	

}
