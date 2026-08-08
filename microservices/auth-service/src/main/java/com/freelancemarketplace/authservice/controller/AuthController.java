package com.freelancemarketplace.authservice.controller;

import com.freelancemarketplace.authservice.dto.request.LoginRequest;
import com.freelancemarketplace.authservice.dto.request.RegisterRequest;
import com.freelancemarketplace.authservice.dto.response.AuthResponse;
import com.freelancemarketplace.authservice.dto.response.TokenValidationResponse;
import com.freelancemarketplace.authservice.service.AuthService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received public registration request for: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("User registered successfully", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for identifier: {}", request.getIdentifier());
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
}
