package com.freelancemarketplace.authservice.service;

import com.freelancemarketplace.authservice.dto.request.LoginRequest;
import com.freelancemarketplace.authservice.dto.request.RegisterRequest;
import com.freelancemarketplace.authservice.dto.response.AuthResponse;
import com.freelancemarketplace.authservice.dto.response.TokenValidationResponse;
import com.freelancemarketplace.authservice.entity.AuthUser;
import com.freelancemarketplace.authservice.repository.AuthUserRepository;
import com.freelancemarketplace.authservice.security.JwtUtils;
import com.freelancemarketplace.authservice.service.impl.AuthServiceImpl;
import com.freelancemarketplace.shared.dto.Role;
import com.freelancemarketplace.shared.exception.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.freelancemarketplace.authservice.client.UserClient;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthUserRepository authUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private AuthServiceImpl authService;

    private AuthUser sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = AuthUser.builder()
                .id(1L)
                .username("john_doe")
                .email("john@example.com")
                .passwordHash("$2a$12$hashedPassword")
                .role(Role.ROLE_FREELANCER)
                .active(true)
                .blocked(false)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new FREELANCER")
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .username("john_doe")
                .email("john@example.com")
                .password("SecurePass123!")
                .role(Role.ROLE_FREELANCER)
                .build();

        when(authUserRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(authUserRepository.existsByUsername("john_doe")).thenReturn(false);
        when(passwordEncoder.encode("SecurePass123!")).thenReturn("$2a$12$hashedPassword");
        when(authUserRepository.save(any(AuthUser.class))).thenReturn(sampleUser);
        when(jwtUtils.generateToken(sampleUser)).thenReturn("mocked.jwt.token");
        when(jwtUtils.getExpirationDurationMs()).thenReturn(86400000L);

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("john_doe");
        assertThat(response.getRole()).isEqualTo(Role.ROLE_FREELANCER);

        verify(authUserRepository).save(any(AuthUser.class));
    }

    @Test
    @DisplayName("Should reject public registration for ROLE_ADMIN")
    void register_AdminRole_ThrowsBadRequestException() {
        RegisterRequest request = RegisterRequest.builder()
                .username("admin_user")
                .email("admin@example.com")
                .password("SecurePass123!")
                .role(Role.ROLE_ADMIN)
                .build();

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("ADMIN registration is strictly restricted");

        verify(authUserRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw ConflictException when email is already taken")
    void register_DuplicateEmail_ThrowsConflictException() {
        RegisterRequest request = RegisterRequest.builder()
                .username("john_doe")
                .email("john@example.com")
                .password("SecurePass123!")
                .role(Role.ROLE_CLIENT)
                .build();

        when(authUserRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Email 'john@example.com' is already registered");

        verify(authUserRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .identifier("john@example.com")
                .password("SecurePass123!")
                .build();

        when(authUserRepository.findByIdentifier("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("SecurePass123!", sampleUser.getPasswordHash())).thenReturn(true);
        when(jwtUtils.generateToken(sampleUser)).thenReturn("mocked.jwt.token");
        when(jwtUtils.getExpirationDurationMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should throw UnauthorizedException on wrong password")
    void login_WrongPassword_ThrowsUnauthorizedException() {
        LoginRequest request = LoginRequest.builder()
                .identifier("john@example.com")
                .password("WrongPassword")
                .build();

        when(authUserRepository.findByIdentifier("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", sampleUser.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid username/email or password");
    }

    @Test
    @DisplayName("Should throw AccountBlockedException when user is blocked")
    void login_BlockedUser_ThrowsAccountBlockedException() {
        sampleUser.setBlocked(true);
        LoginRequest request = LoginRequest.builder()
                .identifier("john@example.com")
                .password("SecurePass123!")
                .build();

        when(authUserRepository.findByIdentifier("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("SecurePass123!", sampleUser.getPasswordHash())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(AccountBlockedException.class)
                .hasMessageContaining("Account has been suspended by administration");
    }

    @Test
    @DisplayName("Should validate active JWT token and extract claims")
    void validateToken_ValidToken_ReturnsValidResponse() {
        String token = "valid.jwt.token";

        when(jwtUtils.validateToken(token)).thenReturn(true);
        when(jwtUtils.extractUserId(token)).thenReturn(1L);
        when(jwtUtils.extractUsername(token)).thenReturn("john_doe");
        when(jwtUtils.extractEmail(token)).thenReturn("john@example.com");
        when(jwtUtils.extractRole(token)).thenReturn(Role.ROLE_FREELANCER);
        when(jwtUtils.extractIssuedAt(token)).thenReturn(new Date());
        when(jwtUtils.extractExpiration(token)).thenReturn(new Date(System.currentTimeMillis() + 3600000));

        TokenValidationResponse response = authService.validateToken("Bearer " + token);

        assertThat(response.isValid()).isTrue();
        assertThat(response.getUsername()).isEqualTo("john_doe");
        assertThat(response.getRole()).isEqualTo(Role.ROLE_FREELANCER);
    }
}
