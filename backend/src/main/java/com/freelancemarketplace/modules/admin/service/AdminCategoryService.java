package com.freelancemarketplace.modules.admin.service;

import java.util.List;

import com.freelancemarketplace.modules.admin.record.CategoryRecord;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;

public interface AdminCategoryService {
    List<CategoryRecord> getAllCategories();

    void createCategory(CreateCategoryRecord record);

}
