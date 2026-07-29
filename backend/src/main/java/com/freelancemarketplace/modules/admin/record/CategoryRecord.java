package com.freelancemarketplace.modules.admin.record;

import java.time.LocalDate;
import java.util.List;

public record CategoryRecord(
		Long id,
		String categoryName,
		String categorySlug,
		Long parentCategoryId,
		String parentCategoryName,
		List<CategoryRecord> subCategories,
		LocalDate createdOn
) {}
