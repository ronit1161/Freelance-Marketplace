package com.freelancemarketplace.userservice.controller;

import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.userservice.dto.request.UpdateUserProfileRequest;
import com.freelancemarketplace.userservice.dto.response.FreelancerProfileResponse;
import com.freelancemarketplace.userservice.dto.response.UserProfileResponse;
import com.freelancemarketplace.userservice.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfileByUserId(@PathVariable Long userId) {
        UserProfileResponse response = userProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUserProfile(
            @RequestHeader("X-User-Id") Long authenticatedUserId
    ) {
        UserProfileResponse response = userProfileService.getProfileByUserId(authenticatedUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateCurrentUserProfile(
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        UserProfileResponse response = userProfileService.updateProfile(authenticatedUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/internal/init")
    public ResponseEntity<ApiResponse<UserProfileResponse>> initializeProfile(
            @Valid @RequestBody InitializeProfileRequest request
    ) {
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
        List<FreelancerProfileResponse> response = userProfileService.getFreelancers(skill, minExperience);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
