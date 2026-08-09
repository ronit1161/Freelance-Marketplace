package com.freelancemarketplace.userservice.dto.response;

import com.freelancemarketplace.shared.dto.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long profileId;

    private Long userId;

    private String fullName;

    private String bio;

    private String skills;

    private Integer experienceYears;

    private String profileAvatarUrl;

    private Role role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
