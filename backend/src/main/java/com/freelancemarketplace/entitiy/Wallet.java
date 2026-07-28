package com.freelancemarketplace.entitiy;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "wallets")
@AttributeOverride(name="id",column = @Column(name="wallet_id"))
@Getter
@Setter
@NoArgsConstructor
public class Wallet extends BaseEntity {

	@Column(name = "available_balance", nullable = false, precision = 15, scale = 4)
    private BigDecimal availableBalance=BigDecimal.ZERO;//for balance usable
	@Column(name = "held_balance", nullable = false, precision = 15, scale = 4)
    private BigDecimal heldBalance=BigDecimal.ZERO;//for balance held for eskrow implementation
	@Column(name = "total_balance", nullable = false, precision = 15, scale = 4)
    private BigDecimal totalBalance=BigDecimal.ZERO;//for balance held for eskrow implementation
	@OneToOne(mappedBy = "wallet")
	@JoinColumn
	private User user;
}
