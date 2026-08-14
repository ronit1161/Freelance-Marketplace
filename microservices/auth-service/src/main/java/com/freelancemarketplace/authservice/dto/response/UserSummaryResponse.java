package com.freelancemarketplace.authservice.dto.response;

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
public class UserSummaryResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean active;
    private boolean blocked;
    private LocalDateTime createdAt;
}
