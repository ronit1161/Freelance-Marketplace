package com.freelancemarketplace.modules.walletTransactions.entity;


import com.freelancemarketplace.entitiy.BaseEntity;
import com.freelancemarketplace.modules.transactions.entity.Transaction;
import com.freelancemarketplace.modules.wallet.entity.Wallet;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name="wallet_transactions")
public class WalletTransaction extends BaseEntity{
	
	@MapsId()
	@OneToOne(fetch = FetchType.LAZY,optional =false )
	@JoinColumn(name = "transaction_id")
	private Transaction transaction;
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_wallet_id", nullable = false)
    private Wallet clientWallet;
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "freelancer_wallet_id", nullable = false)
    private Wallet freelancerWallet;
	
	
}

