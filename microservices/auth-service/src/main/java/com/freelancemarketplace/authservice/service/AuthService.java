package com.freelancemarketplace.authservice.service;

import com.freelancemarketplace.authservice.dto.request.LoginRequest;
import com.freelancemarketplace.authservice.dto.request.RegisterRequest;
import com.freelancemarketplace.authservice.dto.response.AuthResponse;
import com.freelancemarketplace.authservice.dto.response.TokenValidationResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    TokenValidationResponse validateToken(String token);

    AuthResponse getCurrentUser(String username);
}
