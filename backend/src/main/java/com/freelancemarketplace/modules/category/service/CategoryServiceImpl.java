package com.freelancemarketplace.modules.category.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.freelancemarketplace.modules.category.entity.Category;
import com.freelancemarketplace.modules.category.mapper.CategoryMapper;
import com.freelancemarketplace.modules.category.records.CategoryResponseRecord;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;
import com.freelancemarketplace.modules.category.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    // GET ALL
    @Override
    public List<CategoryResponseRecord> getAllCategories() {

        List<Category> categories = categoryRepository.findAll();

        List<CategoryResponseRecord> responseList = new ArrayList<>();

        for (Category category : categories) {
            responseList.add(categoryMapper.toDto(category));
        }

        return responseList;
    }

    // GET BY ID
    @Override
    public CategoryResponseRecord getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toDto(category);
    }

    // CREATE
    @Override
    public CategoryResponseRecord createCategory(CreateCategoryRecord dto) {

        Category category = categoryMapper.toEntity(dto);

        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toDto(savedCategory);
    }

    // UPDATE
    @Override
    public CategoryResponseRecord updateCategory(Long id, CreateCategoryRecord dto) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setCategoryName(dto.categoryName());

        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.toDto(updatedCategory);
    }

    // HARD DELETE 
    @Override
    public void deleteCategory(Long id) {

        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }

        categoryRepository.deleteById(id);
    }
}
