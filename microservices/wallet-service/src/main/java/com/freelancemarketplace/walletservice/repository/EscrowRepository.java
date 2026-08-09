package com.freelancemarketplace.walletservice.repository;

import com.freelancemarketplace.walletservice.entity.Escrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EscrowRepository extends JpaRepository<Escrow, Long> {

    Optional<Escrow> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);
}
