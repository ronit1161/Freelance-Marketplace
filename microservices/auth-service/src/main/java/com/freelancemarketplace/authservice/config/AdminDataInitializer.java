package com.freelancemarketplace.authservice.config;

import com.freelancemarketplace.authservice.client.UserClient;
import com.freelancemarketplace.authservice.entity.AuthUser;
import com.freelancemarketplace.authservice.repository.AuthUserRepository;
import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.shared.dto.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminDataInitializer {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserClient userClient;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> {
            String adminEmail = "admin@marketplace.com";
            String adminUsername = "admin";

            if (!authUserRepository.existsByEmail(adminEmail) && !authUserRepository.existsByUsername(adminUsername)) {
                AuthUser adminUser = AuthUser.builder()
                        .username(adminUsername)
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode("Admin@12345"))
                        .role(Role.ROLE_ADMIN)
                        .active(true)
                        .blocked(false)
                        .build();

                AuthUser savedAdmin = authUserRepository.save(adminUser);

                try {
                    userClient.initializeProfile(
                            InitializeProfileRequest.builder()
                                    .userId(savedAdmin.getId())
                                    .role(Role.ROLE_ADMIN)
                                    .fullName("System Administrator")
                                    .build()
                    );
                } catch (Exception ignored) {
                }
            }
        };
    }
}
