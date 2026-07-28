package com.freelancemarketplace.modules.catagory.entity;

import java.util.ArrayList;
import java.util.List;

import com.freelancemarketplace.entitiy.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "categories")
@AttributeOverride(name="id",column = @Column(name="category_id"))
public class Category extends BaseEntity {
	@Column(name="category_name",length = 30,nullable = false)
	private String categoryName;
	@Column(name="category_slug",nullable = false,unique = true)
	private String categorySlug;//URL safe identifier
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parentCategory;

    // 2. The Parent Side: ONE category has MANY subcategories
    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> subCategories = new ArrayList<>();
	
}
