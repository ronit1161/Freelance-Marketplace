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


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserServiceImplementation userServiceImplementation;
	
	@PostMapping
	public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRecord user){
		UserResponseRecord userResponseRecord=userServiceImplementation.createUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(userResponseRecord));
	}
	
	@GetMapping("{userId}")
	public ResponseEntity<?> getUserDetails(@PathVariable Long userId) {
		UserResponseRecord userResponseRecord=userServiceImplementation.findUserById(userId);
		return ResponseEntity.status(HttpStatus.FOUND).body(ApiResponse.success(userResponseRecord));
	}
	
	@PutMapping("{userId}")
	public ResponseEntity<?> updateUserDetails(@PathVariable Long userId,@Valid @RequestBody CreateUserRecord user){
		UserResponseRecord userResponseRecord=userServiceImplementation.updateUserDetails(userId,user);
		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(userResponseRecord));

	}
	@DeleteMapping("{userid}")
	public ResponseEntity<?> deleteUser(@PathVariable Long userId){
		userServiceImplementation.deleteUser(userId);
		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
	}
	
}
