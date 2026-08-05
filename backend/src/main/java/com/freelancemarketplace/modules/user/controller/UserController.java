package com.freelancemarketplace.modules.user.controller;

import com.freelancemarketplace.modules.user.record.UserResponseRecord;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.service.UserServiceImplementation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.freelancemarketplace.security.CustomUserDetails;
import com.freelancemarketplace.modules.user.record.UpdateProfileRecord;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserServiceImplementation userServiceImplementation;
	
	@PostMapping
	public ResponseEntity<ApiResponse<UserResponseRecord>> createUser(@Valid @RequestBody CreateUserRecord user){
		UserResponseRecord userResponseRecord = userServiceImplementation.createUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(userResponseRecord));
	}

	@GetMapping("/me")
	public ResponseEntity<ApiResponse<UserResponseRecord>> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
		UserResponseRecord userResponseRecord = userServiceImplementation.findUserById(userDetails.getId());
		return ResponseEntity.ok(ApiResponse.success(userResponseRecord));
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<ApiResponse<UserResponseRecord>> getUserDetails(@PathVariable Long userId) {
		UserResponseRecord userResponseRecord = userServiceImplementation.findUserById(userId);
		return ResponseEntity.ok(ApiResponse.success(userResponseRecord));
	}
	
	@PutMapping("/{userId}")
	@PreAuthorize("#userId == principal.id or hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<UserResponseRecord>> updateUserDetails(@PathVariable Long userId, @RequestBody CreateUserRecord user){
		UserResponseRecord userResponseRecord = userServiceImplementation.updateUserDetails(userId, user);
		return ResponseEntity.ok(ApiResponse.success(userResponseRecord));
	}

	@PutMapping("/{userId}/profile")
	@PreAuthorize("#userId == principal.id or hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<UserResponseRecord>> updateProfile(@PathVariable Long userId, @Valid @RequestBody UpdateProfileRecord profileRecord){
		UserResponseRecord userResponseRecord = userServiceImplementation.updateProfile(userId, profileRecord);
		return ResponseEntity.ok(ApiResponse.success(userResponseRecord));
	}

	@DeleteMapping("/{userId}")
	@PreAuthorize("#userId == principal.id or hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId){
		userServiceImplementation.deleteUser(userId);
		return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
	}
}
