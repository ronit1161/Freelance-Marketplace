package com.freelancemarketplace.modules.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.user.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

}
