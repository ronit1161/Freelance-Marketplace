package modules.user.dto;

import jakarta.validation.constraints.*;
import lombok.ToString;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import enums.UserRoles;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreatedUserRequest(
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
		String password,
		@NotBlank(message = "full name cannot be blank")
		@Size(min = 3,max = 20)
		String fullName,
		@NotBlank(message = "full name cannot be blank")
		String profileAvatarURL,
		@NotBlank(message = "Role cannot be blank")
		UserRoles role,
		@NotBlank(message = "bio data cannot be blank")
		String bioData
		) {}
