package com.freelancemarketplace.modules.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.user.entity.User;



public interface UserRepository extends JpaRepository<User, Long> {
	
}
