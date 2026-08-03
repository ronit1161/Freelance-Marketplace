package com.freelancemarketplace.modules.transactions.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.freelancemarketplace.modules.transactions.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.createdOn >= :startDate AND t.createdOn <= :endDate")
    BigDecimal sumAmountByCreatedOnBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
