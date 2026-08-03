package com.freelancemarketplace.common.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.freelancemarketplace.enums.UserRoles;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.modules.wallet.entity.Wallet;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@marketplace.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setUserName("admin");
                admin.setEmail(adminEmail);
                admin.setFullName("Platform Admin");
                admin.setHashedPassword(passwordEncoder.encode("admin123"));
                admin.setRole(UserRoles.ADMIN);
                admin.setActive(true);
                admin.setWallet(new Wallet());
                userRepository.save(admin);
                System.out.println("=================================================");
                System.out.println("  DEFAULT ADMIN ACCOUNT CREATED  ");
                System.out.println("  Email:    admin@marketplace.com");
                System.out.println("  Password: admin123");
                System.out.println("=================================================");
            }
        };
    }
}
