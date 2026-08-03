package com.freelancemarketplace.modules.admin.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.admin.record.CategoryRecord;
import com.freelancemarketplace.modules.admin.service.AdminCategoryService;
import com.freelancemarketplace.modules.category.entity.Category;
import com.freelancemarketplace.modules.category.mapper.CategoryMapper;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;
import com.freelancemarketplace.modules.category.repository.CategoryRepository;
import com.freelancemarketplace.modules.gigs.repository.GigRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminCategoryServiceImpl implements AdminCategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final GigRepository gigRepository;

    @Override
    public List<CategoryRecord> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(c -> {
            long count = gigRepository.countByCategoryIdAndIsDeletedFalse(c.getId());
            return new CategoryRecord(c.getId(), c.getCategoryName(), count);
        }).toList();
    }

    @Override
    public void createCategory(CreateCategoryRecord record) {
        Category category = categoryMapper.toEntity(record);
        categoryRepository.save(category);

    }

}
