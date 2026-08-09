package com.freelancemarketplace.gigservice.controller;

import com.freelancemarketplace.gigservice.dto.request.CreateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.response.CategoryResponse;
import com.freelancemarketplace.gigservice.service.CategoryService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> response = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        CategoryResponse response = categoryService.createCategory(request, authenticatedUserRole);
        return new ResponseEntity<>(ApiResponse.success("Category created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        CategoryResponse response = categoryService.updateCategory(id, request, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String authenticatedUserRole
    ) {
        categoryService.deleteCategory(id, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
