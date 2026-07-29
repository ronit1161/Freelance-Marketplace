package com.freelancemarketplace.modules.catagory.records;

public record CategoryResponseRecord(
        Long id,
        String categoryName,
        String categorySlug,
        Long parentCategoryId
) {}
