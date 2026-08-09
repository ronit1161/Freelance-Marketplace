package com.freelancemarketplace.gigservice.service.impl;

import com.freelancemarketplace.gigservice.dto.request.CreateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.response.CategoryResponse;
import com.freelancemarketplace.gigservice.entity.Category;
import com.freelancemarketplace.gigservice.repository.CategoryRepository;
import com.freelancemarketplace.gigservice.service.CategoryService;
import com.freelancemarketplace.shared.exception.ConflictException;
import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByActiveTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request, String userRole) {
        enforceAdmin(userRole, "create a category");

        String categoryName = request.getName().trim();
        if (categoryRepository.existsByNameIgnoreCase(categoryName)) {
            throw new ConflictException(String.format("Category with name '%s' already exists", categoryName));
        }

        Category category = Category.builder()
                .name(categoryName)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .active(true)
                .build();

        Category savedCategory = categoryRepository.save(category);
        log.info("Admin created new Category ID: {}, Name: '{}'", savedCategory.getId(), savedCategory.getName());
        return mapToResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request, String userRole) {
        enforceAdmin(userRole, "update a category");

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        String categoryName = request.getName().trim();
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(categoryName, id)) {
            throw new ConflictException(String.format("Category with name '%s' already exists", categoryName));
        }

        category.setName(categoryName);
        category.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        Category updatedCategory = categoryRepository.save(category);
        log.info("Admin updated Category ID: {}", updatedCategory.getId());
        return mapToResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id, String userRole) {
        enforceAdmin(userRole, "delete a category");

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setActive(false);
        categoryRepository.save(category);
        log.info("Admin soft-deleted Category ID: {}", id);
    }

    private void enforceAdmin(String userRole, String action) {
        if (userRole == null || !"ROLE_ADMIN".equalsIgnoreCase(userRole)) {
            log.warn("Access denied: role '{}' attempted to {}", userRole, action);
            throw new ForbiddenException("Only administrators are permitted to " + action);
        }
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.isActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
