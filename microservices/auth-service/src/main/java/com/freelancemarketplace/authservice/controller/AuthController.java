package com.freelancemarketplace.authservice.controller;

import com.freelancemarketplace.authservice.dto.request.LoginRequest;
import com.freelancemarketplace.authservice.dto.request.RegisterRequest;
import com.freelancemarketplace.authservice.dto.response.AuthResponse;
import com.freelancemarketplace.authservice.dto.response.TokenValidationResponse;
import com.freelancemarketplace.authservice.service.AuthService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("User registered successfully", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Authentication successful", response)
        );
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<TokenValidationResponse>> validateToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        TokenValidationResponse response = authService.validateToken(authHeader);
        return ResponseEntity.ok(
                ApiResponse.success("Token validation evaluated", response)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        AuthResponse response = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(
                ApiResponse.success("Current authenticated user retrieved", response)
        );
    }

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<java.util.List<com.freelancemarketplace.authservice.dto.response.UserSummaryResponse>>> getAllUsers(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean isAdmin = (userRole != null && "ROLE_ADMIN".equalsIgnoreCase(userRole)) ||
                (userDetails != null && userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_ADMIN")));
        if (!isAdmin) {
            throw new com.freelancemarketplace.shared.exception.ForbiddenException("Only administrators can view all users");
        }
        return ResponseEntity.ok(
                ApiResponse.success("Users retrieved successfully", authService.getAllUsers())
        );
    }

    @PatchMapping("/admin/users/{userId}/toggle-block")
    public ResponseEntity<ApiResponse<com.freelancemarketplace.authservice.dto.response.UserSummaryResponse>> toggleBlockUser(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long currentAdminId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean isAdmin = (userRole != null && "ROLE_ADMIN".equalsIgnoreCase(userRole)) ||
                (userDetails != null && userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_ADMIN")));
        if (!isAdmin) {
            throw new com.freelancemarketplace.shared.exception.ForbiddenException("Only administrators can block/unblock users");
        }
        com.freelancemarketplace.authservice.dto.response.UserSummaryResponse response = authService.toggleBlockUser(userId, currentAdminId);
        return ResponseEntity.ok(
                ApiResponse.success("User block status updated", response)
        );
    }
}
