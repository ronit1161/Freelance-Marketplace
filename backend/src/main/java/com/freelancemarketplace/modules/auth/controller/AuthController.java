package com.freelancemarketplace.modules.auth.controller;

import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.modules.auth.record.AuthRequestRecord;
import com.freelancemarketplace.modules.auth.record.AuthResponseRecord;
import com.freelancemarketplace.modules.auth.service.AuthService;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseRecord>> login(@Valid @RequestBody AuthRequestRecord request) {
        AuthResponseRecord response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseRecord>> register(@Valid @RequestBody CreateUserRecord request) {
        AuthResponseRecord response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }
}
