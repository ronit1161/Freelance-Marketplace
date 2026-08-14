package com.freelancemarketplace.authservice.service.impl;

import com.freelancemarketplace.authservice.client.UserClient;
import com.freelancemarketplace.authservice.dto.request.LoginRequest;
import com.freelancemarketplace.authservice.dto.request.RegisterRequest;
import com.freelancemarketplace.authservice.dto.response.AuthResponse;
import com.freelancemarketplace.authservice.dto.response.TokenValidationResponse;
import com.freelancemarketplace.authservice.entity.AuthUser;
import com.freelancemarketplace.authservice.repository.AuthUserRepository;
import com.freelancemarketplace.authservice.security.JwtUtils;
import com.freelancemarketplace.authservice.service.AuthService;
import com.freelancemarketplace.authservice.dto.response.UserSummaryResponse;
import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.shared.dto.Role;
import com.freelancemarketplace.shared.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserClient userClient;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Enforce Role Restriction: ADMIN cannot be registered publicly
        if (request.getRole() == Role.ROLE_ADMIN) {
            throw new BadRequestException("ADMIN registration is strictly restricted and cannot be created through public registration");
        }

        // 2. Validate Email Uniqueness
        if (authUserRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException(String.format("Email '%s' is already registered", request.getEmail()));
        }

        // 3. Validate Username Uniqueness
        if (authUserRepository.existsByUsername(request.getUsername().trim())) {
            throw new ConflictException(String.format("Username '%s' is already taken", request.getUsername()));
        }

        // 4. Hash Password with BCrypt
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // 5. Build and Save AuthUser entity
        AuthUser authUser = AuthUser.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordHash)
                .role(request.getRole())
                .active(true)
                .blocked(false)
                .build();

        AuthUser savedUser = authUserRepository.save(authUser);

        // 6. Synchronously initialize user profile in User Service via OpenFeign
        try {
            userClient.initializeProfile(
                    InitializeProfileRequest.builder()
                            .userId(savedUser.getId())
                            .role(savedUser.getRole())
                            .fullName(savedUser.getUsername())
                            .build()
            );
        } catch (Exception e) {
            throw new ApiException("User profile creation failed. Please try again later.", HttpStatus.SERVICE_UNAVAILABLE);
        }

        // 7. Generate JWT Token
        String token = jwtUtils.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .expiresIn(jwtUtils.getExpirationDurationMs())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();

        // 1. Retrieve User Credentials
        AuthUser user = authUserRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new UnauthorizedException("Invalid username/email or password"));

        // 2. Verify Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid username/email or password");
        }

        // 3. Verify Account State - Active Flag
        if (!user.isActive()) {
            throw new AccountDisabledException("Account is currently disabled. Please contact support.");
        }

        // 4. Verify Account State - Blocked Flag
        if (user.isBlocked()) {
            throw new AccountBlockedException("Account has been suspended by administration.");
        }

        // 5. Generate JWT Token
        String token = jwtUtils.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(jwtUtils.getExpirationDurationMs())
                .build();
    }

    @Override
    public TokenValidationResponse validateToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token == null || !jwtUtils.validateToken(token)) {
            return TokenValidationResponse.builder()
                    .valid(false)
                    .build();
        }

        return TokenValidationResponse.builder()
                .valid(true)
                .userId(jwtUtils.extractUserId(token))
                .username(jwtUtils.extractUsername(token))
                .email(jwtUtils.extractEmail(token))
                .role(jwtUtils.extractRole(token))
                .issuedAt(jwtUtils.extractIssuedAt(token))
                .expiresAt(jwtUtils.extractExpiration(token))
                .build();
    }

    @Override
    public AuthResponse getCurrentUser(String username) {
        AuthUser user = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("AuthUser", "username", username));

        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public List<com.freelancemarketplace.authservice.dto.response.UserSummaryResponse> getAllUsers() {
        return authUserRepository.findAll().stream()
                .map(u -> com.freelancemarketplace.authservice.dto.response.UserSummaryResponse.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .active(u.isActive())
                        .blocked(u.isBlocked())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public com.freelancemarketplace.authservice.dto.response.UserSummaryResponse toggleBlockUser(Long userId, Long currentAdminId) {
        AuthUser user = authUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole() == com.freelancemarketplace.shared.dto.Role.ROLE_ADMIN) {
            throw new com.freelancemarketplace.shared.exception.BadRequestException("Cannot block administrator accounts");
        }

        user.setBlocked(!user.isBlocked());
        AuthUser saved = authUserRepository.save(user);

        return com.freelancemarketplace.authservice.dto.response.UserSummaryResponse.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .role(saved.getRole())
                .active(saved.isActive())
                .blocked(saved.isBlocked())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
