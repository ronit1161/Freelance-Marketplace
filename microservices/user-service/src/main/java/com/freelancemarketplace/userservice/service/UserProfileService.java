package com.freelancemarketplace.userservice.service;

import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.userservice.dto.request.UpdateUserProfileRequest;
import com.freelancemarketplace.userservice.dto.response.FreelancerProfileResponse;
import com.freelancemarketplace.userservice.dto.response.UserProfileResponse;

import java.util.List;

public interface UserProfileService {

    UserProfileResponse getProfileByUserId(Long userId);

    UserProfileResponse updateProfile(Long userId, UpdateUserProfileRequest request);

    UserProfileResponse initializeProfile(InitializeProfileRequest request);

    List<FreelancerProfileResponse> getFreelancers(String skill, Integer minExperience);
}
