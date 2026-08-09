package com.freelancemarketplace.userservice.service;

import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.shared.dto.Role;
import com.freelancemarketplace.shared.exception.ConflictException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import com.freelancemarketplace.userservice.dto.request.UpdateUserProfileRequest;
import com.freelancemarketplace.userservice.dto.response.FreelancerProfileResponse;
import com.freelancemarketplace.userservice.dto.response.UserProfileResponse;
import com.freelancemarketplace.userservice.entity.UserProfile;
import com.freelancemarketplace.userservice.repository.UserProfileRepository;
import com.freelancemarketplace.userservice.service.impl.UserProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserProfileServiceImpl userProfileService;

    private UserProfile sampleProfile;

    @BeforeEach
    void setUp() {
        sampleProfile = UserProfile.builder()
                .id(1L)
                .userId(101L)
                .fullName("John Doe")
                .bio("Senior Full Stack Developer")
                .skills("Java, Spring Boot, React")
                .experienceYears(5)
                .profileAvatarUrl("https://example.com/avatar.jpg")
                .role(Role.ROLE_FREELANCER)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should successfully initialize a new profile from Auth Service")
    void initializeProfile_Success() {
        InitializeProfileRequest request = InitializeProfileRequest.builder()
                .userId(102L)
                .role(Role.ROLE_CLIENT)
                .fullName("Jane Smith")
                .build();

        when(userProfileRepository.existsByUserId(102L)).thenReturn(false);
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> {
            UserProfile p = invocation.getArgument(0);
            p.setId(2L);
            p.setCreatedAt(LocalDateTime.now());
            p.setUpdatedAt(LocalDateTime.now());
            return p;
        });

        UserProfileResponse response = userProfileService.initializeProfile(request);

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(102L);
        assertThat(response.getRole()).isEqualTo(Role.ROLE_CLIENT);
        assertThat(response.getFullName()).isEqualTo("Jane Smith");

        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    @DisplayName("Should throw ConflictException when profile for userId already exists")
    void initializeProfile_DuplicateUserId_ThrowsConflictException() {
        InitializeProfileRequest request = InitializeProfileRequest.builder()
                .userId(101L)
                .role(Role.ROLE_FREELANCER)
                .build();

        when(userProfileRepository.existsByUserId(101L)).thenReturn(true);

        assertThatThrownBy(() -> userProfileService.initializeProfile(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Profile already exists for user ID: 101");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully fetch profile by userId")
    void getProfileByUserId_Success() {
        when(userProfileRepository.findByUserIdAndDeletedFalse(101L)).thenReturn(Optional.of(sampleProfile));

        UserProfileResponse response = userProfileService.getProfileByUserId(101L);

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(101L);
        assertThat(response.getFullName()).isEqualTo("John Doe");
        assertThat(response.getSkills()).isEqualTo("Java, Spring Boot, React");
        assertThat(response.getExperienceYears()).isEqualTo(5);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when profile does not exist")
    void getProfileByUserId_NotFound_ThrowsResourceNotFoundException() {
        when(userProfileRepository.findByUserIdAndDeletedFalse(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userProfileService.getProfileByUserId(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("UserProfile not found with userId: '999'");
    }

    @Test
    @DisplayName("Should successfully update profile fields")
    void updateProfile_Success() {
        UpdateUserProfileRequest request = UpdateUserProfileRequest.builder()
                .fullName("Johnathon Doe")
                .bio("Updated Bio: Expert Spring Architect")
                .skills("Java, Spring Boot, Microservices, Docker")
                .experienceYears(7)
                .profileAvatarUrl("https://example.com/new-avatar.jpg")
                .build();

        when(userProfileRepository.findByUserIdAndDeletedFalse(101L)).thenReturn(Optional.of(sampleProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(sampleProfile);

        UserProfileResponse response = userProfileService.updateProfile(101L, request);

        assertThat(response).isNotNull();
        assertThat(sampleProfile.getFullName()).isEqualTo("Johnathon Doe");
        assertThat(sampleProfile.getBio()).isEqualTo("Updated Bio: Expert Spring Architect");
        assertThat(sampleProfile.getSkills()).isEqualTo("Java, Spring Boot, Microservices, Docker");
        assertThat(sampleProfile.getExperienceYears()).isEqualTo(7);

        verify(userProfileRepository).save(sampleProfile);
    }

    @Test
    @DisplayName("Should filter freelancers by skill and minimum experience")
    void searchFreelancers_Success() {
        when(userProfileRepository.searchFreelancers(Role.ROLE_FREELANCER, "Java", 3))
                .thenReturn(List.of(sampleProfile));

        List<FreelancerProfileResponse> freelancers = userProfileService.getFreelancers("Java", 3);

        assertThat(freelancers).hasSize(1);
        assertThat(freelancers.get(0).getUserId()).isEqualTo(101L);
        assertThat(freelancers.get(0).getFullName()).isEqualTo("John Doe");
        assertThat(freelancers.get(0).getSkills()).contains("Java");
    }
}
