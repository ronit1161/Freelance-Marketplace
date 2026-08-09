package com.freelancemarketplace.gigservice.controller;

import com.freelancemarketplace.gigservice.dto.request.CreateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.response.CategoryResponse;
import com.freelancemarketplace.gigservice.service.CategoryService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        log.info("Received request to fetch all categories");
        List<CategoryResponse> response = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        log.info("Received request to fetch category for ID: {}", id);
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to create category '{}' by role: '{}'", request.getName(), authenticatedUserRole);
        CategoryResponse response = categoryService.createCategory(request, authenticatedUserRole);
        return new ResponseEntity<>(ApiResponse.success("Category created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to update category ID: {} by role: '{}'", id, authenticatedUserRole);
        CategoryResponse response = categoryService.updateCategory(id, request, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to delete category ID: {} by role: '{}'", id, authenticatedUserRole);
        categoryService.deleteCategory(id, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
