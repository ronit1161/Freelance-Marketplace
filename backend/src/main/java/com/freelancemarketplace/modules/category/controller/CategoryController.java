package com.freelancemarketplace.modules.category.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freelancemarketplace.modules.category.records.CategoryResponseRecord;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;
import com.freelancemarketplace.modules.category.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import org.springframework.security.access.prepost.PreAuthorize;
import com.freelancemarketplace.common.record.ApiResponse;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET all
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseRecord>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseRecord>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id)));
    }

    // CREATE category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseRecord>> createCategory(@Valid @RequestBody CreateCategoryRecord dto) {
        CategoryResponseRecord response = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Category created successfully"));
    }

    // UPDATE category
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseRecord>> updateCategory(@PathVariable Long id, @Valid @RequestBody CreateCategoryRecord dto) {
        CategoryResponseRecord response = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success(response, "Category updated successfully"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }
}
