package com.freelancemarketplace.gigservice.service;

import com.freelancemarketplace.gigservice.dto.request.CreateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CreateCategoryRequest request, String userRole);

    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request, String userRole);

    void deleteCategory(Long id, String userRole);
}
