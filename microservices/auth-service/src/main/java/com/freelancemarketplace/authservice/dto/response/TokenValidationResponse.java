package com.freelancemarketplace.authservice.dto.response;

import com.freelancemarketplace.shared.dto.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenValidationResponse {

    private boolean valid;

    private Long userId;

    private String username;

    private String email;

    private Role role;

    private Date issuedAt;

    private Date expiresAt;
}
