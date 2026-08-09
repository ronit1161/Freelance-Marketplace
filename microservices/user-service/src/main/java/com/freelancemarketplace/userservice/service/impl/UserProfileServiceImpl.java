package com.freelancemarketplace.userservice.service.impl;

import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.shared.dto.Role;
import com.freelancemarketplace.shared.exception.ConflictException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import com.freelancemarketplace.userservice.dto.request.UpdateUserProfileRequest;
import com.freelancemarketplace.userservice.dto.response.FreelancerProfileResponse;
import com.freelancemarketplace.userservice.dto.response.UserProfileResponse;
import com.freelancemarketplace.userservice.entity.UserProfile;
import com.freelancemarketplace.userservice.repository.UserProfileRepository;
import com.freelancemarketplace.userservice.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByUserId(Long userId) {
        log.info("Fetching profile for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserIdAndDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "userId", userId));

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateUserProfileRequest request) {
        log.info("Updating profile for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserIdAndDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "userId", userId));

        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getSkills() != null) {
            profile.setSkills(request.getSkills().trim());
        }
        if (request.getExperienceYears() != null) {
            profile.setExperienceYears(request.getExperienceYears());
        }
        if (request.getProfileAvatarUrl() != null) {
            profile.setProfileAvatarUrl(request.getProfileAvatarUrl().trim());
        }

        UserProfile updatedProfile = userProfileRepository.save(profile);
        log.info("Successfully updated profile for user ID: {}", userId);
        return mapToResponse(updatedProfile);
    }

    @Override
    @Transactional
    public UserProfileResponse initializeProfile(InitializeProfileRequest request) {
        log.info("Initializing profile for user ID: {} with role: {}", request.getUserId(), request.getRole());

        if (userProfileRepository.existsByUserId(request.getUserId())) {
            log.warn("Profile already exists for user ID: {}", request.getUserId());
            throw new ConflictException(String.format("Profile already exists for user ID: %d", request.getUserId()));
        }

        UserProfile profile = UserProfile.builder()
                .userId(request.getUserId())
                .role(request.getRole())
                .fullName(request.getFullName() != null ? request.getFullName().trim() : "")
                .bio("")
                .skills("")
                .experienceYears(0)
                .profileAvatarUrl(null)
                .deleted(false)
                .build();

        UserProfile savedProfile = userProfileRepository.save(profile);
        log.info("Successfully created initial profile with ID: {} for user ID: {}", savedProfile.getId(), request.getUserId());
        return mapToResponse(savedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FreelancerProfileResponse> getFreelancers(String skill, Integer minExperience) {
        log.info("Searching freelancers with skill filter: '{}' and minExperience: '{}'", skill, minExperience);

        String cleanedSkill = (skill != null && !skill.trim().isEmpty()) ? skill.trim() : null;
        List<UserProfile> freelancers = userProfileRepository.searchFreelancers(Role.ROLE_FREELANCER, cleanedSkill, minExperience);

        return freelancers.stream()
                .map(this::mapToFreelancerResponse)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToResponse(UserProfile entity) {
        return UserProfileResponse.builder()
                .profileId(entity.getId())
                .userId(entity.getUserId())
                .fullName(entity.getFullName())
                .bio(entity.getBio())
                .skills(entity.getSkills())
                .experienceYears(entity.getExperienceYears())
                .profileAvatarUrl(entity.getProfileAvatarUrl())
                .role(entity.getRole())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private FreelancerProfileResponse mapToFreelancerResponse(UserProfile entity) {
        return FreelancerProfileResponse.builder()
                .userId(entity.getUserId())
                .fullName(entity.getFullName())
                .bio(entity.getBio())
                .skills(entity.getSkills())
                .experienceYears(entity.getExperienceYears())
                .profileAvatarUrl(entity.getProfileAvatarUrl())
                .build();
    }
}
