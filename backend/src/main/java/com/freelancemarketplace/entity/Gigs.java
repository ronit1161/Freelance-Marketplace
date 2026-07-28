<<<<<<<< HEAD:backend/src/main/java/com/freelancemarketplace/modules/gigs/entity/Gigs.java
package com.freelancemarketplace.modules.gigs.entity;
========
package com.freelancemarketplace.entity;
>>>>>>>> e11697e (completed transcation and review records):backend/src/main/java/com/freelancemarketplace/entity/Gigs.java

import java.math.BigDecimal;

import com.freelancemarketplace.entitiy.BaseEntity;
import com.freelancemarketplace.modules.catagory.entity.Category;
import com.freelancemarketplace.modules.user.entity.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
<<<<<<<< HEAD:backend/src/main/java/com/freelancemarketplace/modules/gigs/entity/Gigs.java

========
>>>>>>>> e11697e (completed transcation and review records):backend/src/main/java/com/freelancemarketplace/entity/Gigs.java
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
