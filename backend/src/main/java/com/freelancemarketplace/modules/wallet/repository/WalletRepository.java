package com.freelancemarketplace.modules.wallet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freelancemarketplace.modules.wallet.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
	Optional<Wallet> findByUserId(Long userId);
}
