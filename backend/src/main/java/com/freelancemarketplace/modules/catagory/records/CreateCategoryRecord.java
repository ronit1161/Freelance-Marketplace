package com.freelancemarketplace.modules.catagory.records;

public record CreateCategoryRecord(
        String categoryName,
        String categorySlug,
        Long parentCategoryId // nullable
) {}