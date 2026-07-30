package com.freelancemarketplace.modules.category.service;

import java.util.List;

import com.freelancemarketplace.modules.category.records.CategoryResponseRecord;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;

public interface CategoryService {

    List<CategoryResponseRecord> getAllCategories();

    CategoryResponseRecord getCategoryById(Long id);

    CategoryResponseRecord createCategory(CreateCategoryRecord dto);

    CategoryResponseRecord updateCategory(Long id, CreateCategoryRecord dto);

    void deleteCategory(Long id);

}
