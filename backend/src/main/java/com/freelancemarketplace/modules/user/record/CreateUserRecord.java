package com.freelancemarketplace.modules.user.record;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.freelancemarketplace.enums.UserRoles;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateUserRecord(
		@NotBlank(message = "user name cannot be blank")
		@Size(min = 3,max = 20)
		String userName,
		@NotBlank(message = "email cannot be blank")
		@Size(min = 3,max = 20)
		@Email
		String email,
		@NotBlank(message = "password cannot be blank")
		@Size(min = 8,max = 30)
		@Pattern(
		        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
		        message = "Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character"
		    )
		@JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // 1. Never serialize to JSON output
		String hashedPassword,
		@NotBlank(message = "full name cannot be blank")
		@Size(min = 3,max = 20)
		String fullName,
		@NotBlank(message = "full name cannot be blank")
		String profileAvatarURL,
		@NotNull(message = "Role cannot be blank")
		UserRoles role,
		@NotBlank(message = "bio data cannot be blank")
		String bioData,
		@NotBlank(message = "skills cannot be blank")
		String skills,
		@NotNull(message = "experience cannot be blank")
		@Max(value = 75,message = "experience cannot be more than 75")
		Integer experience
		) {}
