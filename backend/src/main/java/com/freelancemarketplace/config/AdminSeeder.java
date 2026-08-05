package com.freelancemarketplace.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.freelancemarketplace.enums.UserRoles;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.modules.wallet.entity.Wallet;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@freelancehub.com";
        String adminUserName = "admin_master";

        boolean emailExists = userRepository.existsByEmail(adminEmail);
        boolean usernameExists = userRepository.existsByUserName(adminUserName) || userRepository.existsByUserName("admin");

        if (!emailExists && !usernameExists) {
            try {
                User admin = new User();
                admin.setFullName("Platform Administrator");
                admin.setUserName(adminUserName);
                admin.setEmail(adminEmail);
                admin.setHashedPassword(passwordEncoder.encode("Admin@12345"));
                admin.setRole(UserRoles.ADMIN);
                admin.setBioData("Master system administrator account.");
                admin.setActive(true);
                admin.setDeleted(false);
                admin.setBlocked(false);

                // Initialize Wallet
                Wallet wallet = new Wallet();
                admin.setWallet(wallet);

                userRepository.save(admin);
                log.info("Successfully seeded default Admin account: {} / Admin@12345", adminEmail);
            } catch (Exception e) {
                log.warn("Admin seeder skipped: {}", e.getMessage());
            }
        } else {
            log.info("Admin user check: Admin user already present in database.");
        }
    }
}
