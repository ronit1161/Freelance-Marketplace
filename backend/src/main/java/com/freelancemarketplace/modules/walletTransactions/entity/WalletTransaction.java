package com.freelancemarketplace.modules.walletTransactions.entity;


import com.freelancemarketplace.common.entity.BaseEntity;
import com.freelancemarketplace.modules.transactions.entity.Transaction;
import com.freelancemarketplace.modules.wallet.entity.Wallet;

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
@Table(name="wallet_transactions")
@AttributeOverride(name="id",column = @Column(name="wallet_transaction_id"))
public class WalletTransaction extends BaseEntity{
	
	@ManyToOne(fetch = FetchType.LAZY,optional =false )
	@JoinColumn(name = "transaction_id")
	private Transaction transaction;
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination_wallet_id", nullable = true)
    private Wallet destinationWallet;
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_wallet_id", nullable = true)
    private Wallet sourceWallet;
}

