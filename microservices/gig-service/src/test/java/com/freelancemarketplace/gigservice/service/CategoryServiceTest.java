package com.freelancemarketplace.gigservice.service;

import com.freelancemarketplace.gigservice.dto.request.CreateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateCategoryRequest;
import com.freelancemarketplace.gigservice.dto.response.CategoryResponse;
import com.freelancemarketplace.gigservice.entity.Category;
import com.freelancemarketplace.gigservice.repository.CategoryRepository;
import com.freelancemarketplace.gigservice.service.impl.CategoryServiceImpl;
import com.freelancemarketplace.shared.exception.ConflictException;
import com.freelancemarketplace.shared.exception.ForbiddenException;
import com.freelancemarketplace.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category sampleCategory;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder()
                .id(1L)
                .name("Graphic Design")
                .description("Logo design, branding, illustration")
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should fetch all active categories")
    void getAllCategories_Success() {
        when(categoryRepository.findAllByActiveTrue()).thenReturn(List.of(sampleCategory));

        List<CategoryResponse> responses = categoryService.getAllCategories();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getName()).isEqualTo("Graphic Design");
    }

    @Test
    @DisplayName("Should fetch single category by ID")
    void getCategoryById_Success() {
        when(categoryRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(sampleCategory));

        CategoryResponse response = categoryService.getCategoryById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Graphic Design");
    }

    @Test
    @DisplayName("Admin should successfully create a new category")
    void createCategory_Admin_Success() {
        CreateCategoryRequest request = CreateCategoryRequest.builder()
                .name("Digital Marketing")
                .description("SEO, Social Media Marketing")
                .build();

        when(categoryRepository.existsByNameIgnoreCase("Digital Marketing")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category c = invocation.getArgument(0);
            c.setId(2L);
            c.setCreatedAt(LocalDateTime.now());
            c.setUpdatedAt(LocalDateTime.now());
            return c;
        });

        CategoryResponse response = categoryService.createCategory(request, "ROLE_ADMIN");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getName()).isEqualTo("Digital Marketing");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    @DisplayName("Freelancer or Client should be forbidden from creating a category")
    void createCategory_NonAdmin_ThrowsForbiddenException() {
        CreateCategoryRequest request = CreateCategoryRequest.builder()
                .name("Digital Marketing")
                .build();

        assertThatThrownBy(() -> categoryService.createCategory(request, "ROLE_FREELANCER"))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Only administrators are permitted to create a category");

        verifyNoInteractions(categoryRepository);
    }

    @Test
    @DisplayName("Admin creating duplicate category should throw ConflictException")
    void createCategory_DuplicateName_ThrowsConflictException() {
        CreateCategoryRequest request = CreateCategoryRequest.builder()
                .name("Graphic Design")
                .build();

        when(categoryRepository.existsByNameIgnoreCase("Graphic Design")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.createCategory(request, "ROLE_ADMIN"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");

        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Admin should successfully update a category")
    void updateCategory_Admin_Success() {
        UpdateCategoryRequest request = UpdateCategoryRequest.builder()
                .name("Updated Graphic Design")
                .description("New Description")
                .active(true)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.existsByNameIgnoreCaseAndIdNot("Updated Graphic Design", 1L)).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);

        CategoryResponse response = categoryService.updateCategory(1L, request, "ROLE_ADMIN");

        assertThat(response).isNotNull();
        assertThat(sampleCategory.getName()).isEqualTo("Updated Graphic Design");
        verify(categoryRepository).save(sampleCategory);
    }

    @Test
    @DisplayName("Admin should successfully soft-delete a category")
    void deleteCategory_Admin_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);

        categoryService.deleteCategory(1L, "ROLE_ADMIN");

        assertThat(sampleCategory.isActive()).isFalse();
        verify(categoryRepository).save(sampleCategory);
    }
}
