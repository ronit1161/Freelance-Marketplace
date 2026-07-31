package com.freelancemarketplace.modules.walletTransactions.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

	List<WalletTransaction> findByClientWalletIdOrFreelancerWalletId(Long clientWalletId, Long freelancerWalletId);
	
}
