package com.freelancemarketplace.gigservice.repository;

import com.freelancemarketplace.gigservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    List<Category> findAllByActiveTrue();

    Optional<Category> findByIdAndActiveTrue(Long id);
}
