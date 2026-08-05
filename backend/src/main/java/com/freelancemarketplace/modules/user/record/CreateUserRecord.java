package com.freelancemarketplace.modules.user.record;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.freelancemarketplace.enums.UserRoles;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateUserRecord(
        String userName,

        @NotBlank(message = "Email cannot be blank") 
        @Email(message = "Invalid email format")
        @Size(max = 100, message = "Email cannot exceed 100 characters")
        String email,

        @NotBlank(message = "Password cannot be blank") 
        @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters") 
        @JsonProperty(value = "password", access = JsonProperty.Access.WRITE_ONLY) 
        String hashedPassword,

        @com.fasterxml.jackson.annotation.JsonAlias({"name", "fullName"})
        @NotBlank(message = "Full name cannot be blank") 
        @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters") 
        String fullName,

        String profileAvatarURL,

        @NotNull(message = "Role cannot be null") 
        UserRoles role,

        String bioData,
        String skills,
        Integer experience
) {}
