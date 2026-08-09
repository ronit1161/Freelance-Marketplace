package com.freelancemarketplace.authservice.config;

import com.freelancemarketplace.authservice.client.UserClient;
import com.freelancemarketplace.authservice.entity.AuthUser;
import com.freelancemarketplace.authservice.repository.AuthUserRepository;
import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import com.freelancemarketplace.shared.dto.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
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
                log.info("No default admin user found. Creating default Administrator account...");

                AuthUser adminUser = AuthUser.builder()
                        .username(adminUsername)
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode("Admin@12345"))
                        .role(Role.ROLE_ADMIN)
                        .active(true)
                        .blocked(false)
                        .build();

                AuthUser savedAdmin = authUserRepository.save(adminUser);
                log.info("Default Admin created successfully with ID: {} (email: {}, password: Admin@12345)", savedAdmin.getId(), adminEmail);

                try {
                    userClient.initializeProfile(
                            InitializeProfileRequest.builder()
                                    .userId(savedAdmin.getId())
                                    .role(Role.ROLE_ADMIN)
                                    .fullName("System Administrator")
                                    .build()
                    );
                    log.info("Admin profile initialized in user-service");
                } catch (Exception e) {
                    log.warn("Could not immediately initialize Admin profile in user-service (service might still be connecting): {}", e.getMessage());
                }
            } else {
                log.info("Admin user already exists in auth_users.");
            }
        };
    }
}
