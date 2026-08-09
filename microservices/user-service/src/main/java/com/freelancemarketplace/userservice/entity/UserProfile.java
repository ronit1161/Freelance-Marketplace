package com.freelancemarketplace.userservice.entity;

import com.freelancemarketplace.shared.dto.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_profiles",
    indexes = {
        @Index(name = "idx_user_profiles_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_user_profiles_role", columnList = "role")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "skills", length = 500)
    private String skills;

    @Builder.Default
    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears = 0;

    @Column(name = "profile_avatar_url", length = 255)
    private String profileAvatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 30)
    private Role role;

    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
