package com.freelancemarketplace.common.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@MappedSuperclass
@Getter
@Setter
@ToString
public class BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@CreationTimestamp //generates auto date at the entity creation time
	@Column(name="created_on")
	private LocalDate createdOn;
	@UpdateTimestamp //generates auto datetime(Timestamp)  at the entity updation time
	@Column(name="last_updated")
	private LocalDateTime lastUpdated;	
}

