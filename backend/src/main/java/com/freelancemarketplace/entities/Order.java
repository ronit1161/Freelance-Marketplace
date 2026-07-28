package com.freelancemarketplace.entities;

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
@AttributeOverride(name="id",column = @Column(name="oreder_id"))
public class Order extends BaseEntity {

		@ManyToOne(fetch = FetchType.LAZY,optional = false)
		@JoinColumn(name = "client_id",nullable = false)
		private User client;
		@ManyToOne(fetch = FetchType.LAZY,optional = false)
		@JoinColumn(name="freelancer_id",nullable = false)
		private User freelancer;
}

/*id	BIGINT UNSIGNED	PKAUTO_INCREMENT	
client_id	BIGINT UNSIGNED	FK → users.idNOT NULL	RESTRICT DELETE — preserve financial history
freelancer_id	BIGINT UNSIGNED	FK → users.idNOT NULL	Denormalized from gig for query speed + history
gig_id	BIGINT UNSIGNED	FK → gigs.idNOT NULL	RESTRICT DELETE
package_id	BIGINT UNSIGNED	FK → gig_packages.idNULL	SET NULL on delete; NULL if no package chosen
price_snapshot	INT UNSIGNED	NOT NULLCHECK > 0	Immutable price at order time — survives gig price changes
requirements	TEXT	—	Client instructions for the freelancer
status	ENUM	NOT NULLDEFAULT 'PENDING'	PENDING | COMPLETED | CANCELLED
created_at	TIMESTAMP	NOT NULLDEFAULT NOW()	
completed_at	TIMESTAMP	NULL	Set when status → COMPLETED
cancelled_at	TIMESTAMP	NULL	Set when status → CANCELLED
CHECK (client_id != freelancer_id) — prevents self-ordering*/
