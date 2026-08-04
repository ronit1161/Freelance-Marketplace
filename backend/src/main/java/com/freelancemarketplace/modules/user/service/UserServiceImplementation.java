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

import com.freelancemarketplace.common.exceptions.ResourceNotFoundException;
import com.freelancemarketplace.enums.ErrorCode;
import com.freelancemarketplace.modules.user.record.UpdateProfileRecord;

@RequiredArgsConstructor
@Service
@Transactional
public class UserServiceImplementation implements UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;

	@Override
	@Transactional
	public UserResponseRecord createUser(CreateUserRecord user) {
		User userEntity = userMapper.toEntity(user);
		userEntity.setWallet(new Wallet());
		userRepository.save(userEntity);
		return userMapper.toDto(userEntity);
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponseRecord findUserById(Long userId) {
		return userRepository.findById(userId)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId, ErrorCode.USER_NOT_FOUND));
    }

	@Override
	@Transactional
	public UserResponseRecord updateUserDetails(Long userId, CreateUserRecord user) {
		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId, ErrorCode.USER_NOT_FOUND));
		if (user.bioData() != null) existingUser.setBioData(user.bioData());
		if (user.email() != null) existingUser.setEmail(user.email());
		if (user.userName() != null) existingUser.setUserName(user.userName());
		if (user.fullName() != null) existingUser.setFullName(user.fullName());
		if (user.profileAvatarURL() != null) existingUser.setProfileAvatarURL(user.profileAvatarURL());
		if (user.skills() != null) existingUser.setSkills(user.skills());
		if (user.experience() != null) existingUser.setExperience(user.experience());

		User updatedUser = userRepository.save(existingUser);
		return userMapper.toDto(updatedUser);
	}

	@Override
	@Transactional
	public UserResponseRecord updateProfile(Long userId, UpdateProfileRecord dto) {
		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId, ErrorCode.USER_NOT_FOUND));

		if (dto.fullName() != null && !dto.fullName().isBlank()) existingUser.setFullName(dto.fullName());
		if (dto.userName() != null && !dto.userName().isBlank()) existingUser.setUserName(dto.userName());
		if (dto.email() != null && !dto.email().isBlank()) existingUser.setEmail(dto.email());
		if (dto.profileAvatarURL() != null) existingUser.setProfileAvatarURL(dto.profileAvatarURL());
		if (dto.bioData() != null) existingUser.setBioData(dto.bioData());
		if (dto.skills() != null) existingUser.setSkills(dto.skills());
		if (dto.experience() != null) existingUser.setExperience(dto.experience());

		User updatedUser = userRepository.save(existingUser);
		return userMapper.toDto(updatedUser);
	}

	@Override
	@Transactional
	public void deleteUser(Long userId) {
		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId, ErrorCode.USER_NOT_FOUND));
		existingUser.setDeleted(true);
		userRepository.save(existingUser);
	}
}
