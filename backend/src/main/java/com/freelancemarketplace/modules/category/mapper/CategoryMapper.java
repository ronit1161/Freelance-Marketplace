package com.freelancemarketplace.modules.category.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.category.entity.Category;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;
import com.freelancemarketplace.modules.category.records.CategoryResponseRecord;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    // DTO → Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "lastUpdated", ignore = true)
    Category toEntity(CreateCategoryRecord dto);

    // Entity → DTO
    CategoryResponseRecord toDto(Category category);
}