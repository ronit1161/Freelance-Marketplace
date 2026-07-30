package com.freelancemarketplace.modules.category.records;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryRecord(

        @NotBlank(message = "Category name is required")
        @Size(max = 30, message = "Category name must be at most 30 characters")
        String categoryName

) {}