package com.freelancemarketplace.modules.gigs.entity;

import java.math.BigDecimal;
import java.util.List;

import com.freelancemarketplace.entitiy.BaseEntity;
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
	
	@Column(name =  "title")
	private String title ;
	
	@Column(name =  "discription")
	private String description ;
	
	@Column(name =  "price")
	private BigDecimal price ;
	
	@Column(name =  "delivery_days")
	private Integer deliveryDays ;
	
	@Column(name =  "thumbnail_url")
	private String thumbnailUrl ;
	
	@Column(name =  "total_orders")
	private Integer totalOrders = 0;
	
	@Column(name =  "is_deleted" )
	private boolean isDeleted = false;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "freelancer_id" , nullable =  false)
	private User freelancer ;
	
	@ManyToOne(fetch = FetchType.LAZY , optional =  false)
	@JoinColumn(name = "catagory_id" , nullable =  false)
	private Category category ;
	
	
	
	
}
