package com.freelancemarketplace.modules.admin.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryRecord(
		@NotBlank(message = "Category name cannot be blank")
		@Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
		String categoryName,

		String categorySlug,

		Long parentCategoryId
) {}
