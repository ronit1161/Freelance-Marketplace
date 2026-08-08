package com.freelancemarketplace.authservice.dto.response;

import com.freelancemarketplace.shared.dto.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;

    private String username;

    private String email;

    private Role role;

    private long expiresIn;
}
