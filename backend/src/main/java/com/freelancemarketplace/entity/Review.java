<<<<<<<< HEAD:backend/src/main/java/com/freelancemarketplace/modules/review/entity/Review.java
package com.freelancemarketplace.modules.review.entity;

import com.freelancemarketplace.entitiy.BaseEntity;
import com.freelancemarketplace.modules.Order.entity.Order;
import com.freelancemarketplace.modules.user.entity.User;
========
package com.freelancemarketplace.entity;
>>>>>>>> e11697e (completed transcation and review records):backend/src/main/java/com/freelancemarketplace/entity/Review.java

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "reviews")
@AttributeOverride(name="id",column = @Column(name="review_id"))
public class Review extends BaseEntity {
	@ManyToOne
	@JoinColumn(name="client_id")
	private User client;
	@ManyToOne
	@JoinColumn(name = "freelancer_id")
	private User freelancer;
	@OneToOne
	@JoinColumn(name="order_id")
	private Order order;
	private Integer rating;
	private String comment;
	
}
