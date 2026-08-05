package com.freelancemarketplace.modules.gigs.entity;

import java.math.BigDecimal;


import com.freelancemarketplace.common.entity.BaseEntity;


import com.freelancemarketplace.modules.category.entity.Category;

import com.freelancemarketplace.modules.user.entity.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table (name = "Gigs")
@AttributeOverride(name="id",column = @Column(name="gig_id"))
@Entity
public class Gigs extends BaseEntity
{
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "description", columnDefinition = "TEXT")
	private String description;
	
	@Column(name = "price")
	private BigDecimal price;
	
	@Column(name = "delivery_days")
	private Integer deliveryDays;
	
	@Column(name = "thumbnail_url")
	private String thumbnailUrl;
	
	@Column(name = "total_orders")
	private Integer totalOrders = 0;
	
	@Column(name = "average_rating")
	private Double averageRating = 0.0;
	
	@Column(name = "total_reviews")
	private Integer totalReviews = 0;
	
	@Column(name = "is_deleted")
	private Boolean isDeleted = false;

	public boolean isDeleted() {
		return Boolean.TRUE.equals(isDeleted);
	}

	public void setDeleted(Boolean deleted) {
		this.isDeleted = deleted;
	}
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "freelancer_id", nullable = false)
	private User freelancer;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;
}
