package com.freelancemarketplace.modules.walletTransactions.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;
import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

	@Query("""
		    SELECT w FROM WalletTransaction w
		    WHERE w.sourceWallet.id = :wid OR w.destinationWallet.id = :wid
		""")
	List<WalletTransaction> getAllWalletTransactionsById(@Param("wid") Long walletId);

	@Query(value = """
			SELECT wt FROM WalletTransaction wt
			JOIN FETCH wt.transaction t
			LEFT JOIN FETCH wt.sourceWallet sw
			LEFT JOIN FETCH wt.destinationWallet dw
			WHERE wt.sourceWallet.id = :walletId OR wt.destinationWallet.id = :walletId
			""",
			countQuery = """
			SELECT COUNT(wt) FROM WalletTransaction wt
			WHERE wt.sourceWallet.id = :walletId OR wt.destinationWallet.id = :walletId
			""")
	Page<WalletTransaction> findByWalletId(@Param("walletId") Long walletId, Pageable pageable);

	@Query("""
			SELECT wt FROM WalletTransaction wt
			JOIN FETCH wt.transaction t
			LEFT JOIN FETCH wt.sourceWallet sw
			LEFT JOIN FETCH wt.destinationWallet dw
			WHERE wt.id = :id
			""")
	Optional<WalletTransaction> findByIdWithDetails(@Param("id") Long id);

	@Query(value = """
			SELECT wt FROM WalletTransaction wt
			JOIN FETCH wt.transaction t
			LEFT JOIN FETCH wt.sourceWallet sw
			LEFT JOIN FETCH wt.destinationWallet dw
			LEFT JOIN FETCH sw.user su
			LEFT JOIN FETCH dw.user du
			WHERE (:type IS NULL OR t.transactionType = :type)
			  AND (:status IS NULL OR t.transactionStatus = :status)
			  AND (:search IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
			       OR CAST(wt.id AS string) LIKE CONCAT('%', :search, '%')
			       OR CAST(t.id AS string) LIKE CONCAT('%', :search, '%')
			       OR LOWER(su.email) LIKE LOWER(CONCAT('%', :search, '%'))
			       OR LOWER(du.email) LIKE LOWER(CONCAT('%', :search, '%')))
			""",
			countQuery = """
			SELECT COUNT(wt) FROM WalletTransaction wt
			JOIN wt.transaction t
			LEFT JOIN wt.sourceWallet sw
			LEFT JOIN wt.destinationWallet dw
			LEFT JOIN sw.user su
			LEFT JOIN dw.user du
			WHERE (:type IS NULL OR t.transactionType = :type)
			  AND (:status IS NULL OR t.transactionStatus = :status)
			  AND (:search IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
			       OR CAST(wt.id AS string) LIKE CONCAT('%', :search, '%')
			       OR CAST(t.id AS string) LIKE CONCAT('%', :search, '%')
			       OR LOWER(su.email) LIKE LOWER(CONCAT('%', :search, '%'))
			       OR LOWER(du.email) LIKE LOWER(CONCAT('%', :search, '%')))
			""")
	Page<WalletTransaction> findAllAdmin(
			@Param("type") TransactionType type,
			@Param("status") TransactionStatus status,
			@Param("search") String search,
			Pageable pageable);
}
