package com.freelancemarketplace.modules.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.freelancemarketplace.modules.category.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}