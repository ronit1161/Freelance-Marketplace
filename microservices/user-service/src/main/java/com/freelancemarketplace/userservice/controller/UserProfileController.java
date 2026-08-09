package com.freelancemarketplace.userservice.controller;

import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.userservice.dto.request.UpdateUserProfileRequest;
import com.freelancemarketplace.userservice.dto.response.FreelancerProfileResponse;
import com.freelancemarketplace.userservice.dto.response.UserProfileResponse;
import com.freelancemarketplace.userservice.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfileByUserId(@PathVariable Long userId) {
        log.info("Received request to fetch profile for user ID: {}", userId);
        UserProfileResponse response = userProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUserProfile(
            @RequestHeader("X-User-Id") Long authenticatedUserId
    ) {
        log.info("Received request to fetch current authenticated user profile for user ID: {}", authenticatedUserId);
        UserProfileResponse response = userProfileService.getProfileByUserId(authenticatedUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateCurrentUserProfile(
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        log.info("Received request to update profile for user ID: {}", authenticatedUserId);
        UserProfileResponse response = userProfileService.updateProfile(authenticatedUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/internal/init")
    public ResponseEntity<ApiResponse<UserProfileResponse>> initializeProfile(
            @Valid @RequestBody InitializeProfileRequest request
    ) {
        log.info("Received internal profile initialization request for user ID: {}", request.getUserId());
        UserProfileResponse response = userProfileService.initializeProfile(request);
        return new ResponseEntity<>(
                ApiResponse.success("User profile initialized successfully", response),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/freelancers")
    public ResponseEntity<ApiResponse<List<FreelancerProfileResponse>>> getFreelancers(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer minExperience
    ) {
        log.info("Received request to search freelancers with skill: '{}' and minExperience: '{}'", skill, minExperience);
        List<FreelancerProfileResponse> response = userProfileService.getFreelancers(skill, minExperience);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
