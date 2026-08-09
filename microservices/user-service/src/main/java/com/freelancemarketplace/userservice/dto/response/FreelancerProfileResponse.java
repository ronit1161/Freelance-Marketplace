package com.freelancemarketplace.userservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerProfileResponse {

    private Long userId;

    private String fullName;

    private String bio;

    private String skills;

    private Integer experienceYears;

    private String profileAvatarUrl;
}
