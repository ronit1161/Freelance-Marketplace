package com.freelancemarketplace.modules.walletTransactions.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

	@Query("""
		    SELECT w FROM WalletTransaction w
		    WHERE w.sourceWallet.id = :wid OR w.destinationWallet.id = :wid
		""")	List<WalletTransaction> getAllWalletTransactionsById(@Param("wid") Long walletId);
}
