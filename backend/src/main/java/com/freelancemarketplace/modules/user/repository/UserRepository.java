package com.freelancemarketplace.modules.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.user.entity.User;




public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByEmail(String email);

	boolean existsByUserName(String userName);

	Optional<User> findByEmail(String email);
	
}
