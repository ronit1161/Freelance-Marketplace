package com.freelancemarketplace.entitiy;

import java.math.BigDecimal;

import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "transactions")
@AttributeOverride(name="id",column = @Column(name="transaction_id"))
public class Transaction extends BaseEntity{
	
	@Column(nullable = false,precision = 15, scale = 4)
	private BigDecimal amount; 
	
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(name="transcation_type")
	private TransactionType transcationType;
	
	@Enumerated(EnumType.STRING)
	@Column(name="transaction_status")
	private TransactionStatus transactionStatus=TransactionStatus.PENDING;
	
}
/*
order_id	BIGINT UNSIGNED	FK → orders.idNULL	SET NULL if order deleted; links tx to order
balance_after	INT UNSIGNED	NOT NULL	Snapshot of available_balance after this tx
held_after	INT UNSIGNED	NOT NULL	Snapshot of held_balance after this tx*/
