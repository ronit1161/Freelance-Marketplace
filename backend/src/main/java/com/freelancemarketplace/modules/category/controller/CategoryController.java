package com.freelancemarketplace.modules.category.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freelancemarketplace.modules.category.records.CategoryResponseRecord;
import com.freelancemarketplace.modules.category.records.CreateCategoryRecord;
import com.freelancemarketplace.modules.category.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {


    private final CategoryService categoryService;



    // GET all
    @GetMapping
    public ResponseEntity<List<CategoryResponseRecord>> getAllCategories(){

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }



    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseRecord> getCategoryById(
            @PathVariable Long id){

        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }



    // CREATE category
    @PostMapping
    public ResponseEntity<CategoryResponseRecord> createCategory(
            @Valid @RequestBody CreateCategoryRecord dto){


        CategoryResponseRecord response =
                categoryService.createCategory(dto);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }




    // UPDATE category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseRecord> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRecord dto){


        CategoryResponseRecord response =
                categoryService.updateCategory(id, dto);


        return ResponseEntity.ok(response);
    }





    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id){


        categoryService.deleteCategory(id);


        return ResponseEntity.noContent().build();
    }

}
