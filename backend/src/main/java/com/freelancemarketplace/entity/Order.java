<<<<<<<< HEAD:backend/src/main/java/com/freelancemarketplace/modules/Order/entity/Order.java
package com.freelancemarketplace.modules.Order.entity;
========
package com.freelancemarketplace.entity;
>>>>>>>> e11697e (completed transcation and review records):backend/src/main/java/com/freelancemarketplace/entity/Order.java

import java.math.BigDecimal;

import com.freelancemarketplace.entitiy.BaseEntity;
import com.freelancemarketplace.enums.OrderStatus;
import com.freelancemarketplace.modules.gigs.entity.Gigs;
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

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "orders")
@AttributeOverride(name="id",column = @Column(name="order_id"))
public class Order extends BaseEntity {
		
		@Column(name = "requirements")
		private String requirements ; 
		
		@Column(name = "agreed_price")
		private BigDecimal agreedPrice ;
		
		@Column(name = "status ")
		private OrderStatus status ; 

		@ManyToOne(fetch = FetchType.LAZY,optional = false)
		@JoinColumn(name = "client_id",nullable = false)
		private User client;
		
		@ManyToOne(fetch = FetchType.LAZY,optional = false)
		@JoinColumn(name="freelancer_id",nullable = false)
		private User freelancer;
		
		@ManyToOne(fetch =  FetchType.LAZY , optional = false)
		@JoinColumn(name = "gig_id" , nullable =  false)
		private Gigs gig ;
		
 		
}

/*id	BIGINT UNSIGNED	PKAUTO_INCREMENT	
1 client_id	BIGINT UNSIGNED	FK → users.idNOT NULL	RESTRICT DELETE — preserve financial history
2 freelancer_id	BIGINT UNSIGNED	FK → users.idNOT NULL	Denormalized from gig for query speed + history
3 gig_id	BIGINT UNSIGNED	FK → gigs.idNOT NULL	RESTRICT DELETE
4 package_id	BIGINT UNSIGNED	FK → gig_packages.idNULL	SET NULL on delete; NULL if no package chosen
5 price_snapshot	INT UNSIGNED	NOT NULLCHECK > 0	Immutable price at order time — survives gig price changes
6 requirements	TEXT	—	Client instructions for the freelancer
7 status	ENUM	NOT NULLDEFAULT 'PENDING'	PENDING | COMPLETED | CANCELLED
created_at	TIMESTAMP	NOT NULLDEFAULT NOW()	
completed_at	TIMESTAMP	NULL	Set when status → COMPLETED
cancelled_at	TIMESTAMP	NULL	Set when status → CANCELLED
CHECK (client_id != freelancer_id) — prevents self-ordering*/
