package com.freelancemarketplace.modules.user.record;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateProfileRecord(
        @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
        String fullName,

        @Size(max = 100, message = "Username cannot exceed 100 characters")
        String userName,

        @Email(message = "Invalid email format")
        String email,

        String profileAvatarURL,
        String bioData,
        String skills,
        Integer experience
) {}
