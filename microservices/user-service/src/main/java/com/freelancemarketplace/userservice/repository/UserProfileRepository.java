package com.freelancemarketplace.userservice.repository;

import com.freelancemarketplace.shared.dto.Role;
import com.freelancemarketplace.userservice.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserIdAndDeletedFalse(Long userId);

    Optional<UserProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    @Query("SELECT p FROM UserProfile p WHERE p.role = :role AND p.deleted = false " +
           "AND (:skill IS NULL OR LOWER(p.skills) LIKE LOWER(CONCAT('%', :skill, '%'))) " +
           "AND (:minExperience IS NULL OR p.experienceYears >= :minExperience)")
    List<UserProfile> searchFreelancers(
            @Param("role") Role role,
            @Param("skill") String skill,
            @Param("minExperience") Integer minExperience
    );
}
