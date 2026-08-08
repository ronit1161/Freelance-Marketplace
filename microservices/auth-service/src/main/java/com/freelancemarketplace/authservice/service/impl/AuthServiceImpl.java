package com.freelancemarketplace.authservice.service.impl;

import com.freelancemarketplace.authservice.dto.request.LoginRequest;
import com.freelancemarketplace.authservice.dto.request.RegisterRequest;
import com.freelancemarketplace.authservice.dto.response.AuthResponse;
import com.freelancemarketplace.authservice.dto.response.TokenValidationResponse;
import com.freelancemarketplace.authservice.entity.AuthUser;
import com.freelancemarketplace.authservice.repository.AuthUserRepository;
import com.freelancemarketplace.authservice.security.JwtUtils;
import com.freelancemarketplace.authservice.service.AuthService;
import com.freelancemarketplace.shared.dto.Role;
import com.freelancemarketplace.shared.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration request for username: {} and email: {}", request.getUsername(), request.getEmail());

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
        log.info("Successfully registered AuthUser with ID: {}", savedUser.getId());

        // 6. Generate JWT Token
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
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        log.info("Processing login attempt for identifier: {}", identifier);

        // 1. Retrieve User Credentials
        AuthUser user = authUserRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new UnauthorizedException("Invalid username/email or password"));

        // 2. Verify Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Failed login attempt - invalid password for identifier: {}", identifier);
            throw new UnauthorizedException("Invalid username/email or password");
        }

        // 3. Verify Account State - Active Flag
        if (!user.isActive()) {
            log.warn("Failed login attempt - account disabled for identifier: {}", identifier);
            throw new AccountDisabledException("Account is currently disabled. Please contact support.");
        }

        // 4. Verify Account State - Blocked Flag
        if (user.isBlocked()) {
            log.warn("Failed login attempt - account blocked for identifier: {}", identifier);
            throw new AccountBlockedException("Account has been suspended by administration.");
        }

        // 5. Generate JWT Token
        String token = jwtUtils.generateToken(user);
        log.info("User {} successfully authenticated with ID: {}", user.getUsername(), user.getId());

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
    @Transactional(readOnly = true)
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
}
