package com.freelancemarketplace.modules.wallet.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.modules.wallet.entity.Wallet;
import com.freelancemarketplace.modules.wallet.mapper.WalletMapper;
import com.freelancemarketplace.modules.wallet.record.AddMoneyRecord;
import com.freelancemarketplace.modules.wallet.record.WalletResponseRecord;
import com.freelancemarketplace.modules.wallet.repository.WalletRepository;
import com.freelancemarketplace.modules.walletTransactions.mapper.WalletTransactionmapper;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;
import com.freelancemarketplace.modules.walletTransactions.repository.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
	
	private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;
    private final WalletMapper walletMapper;
    private final WalletTransactionmapper walletTransactionmapper;    
    @Override
    public WalletResponseRecord getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createInitialWallet(userId));
        return walletMapper.toDto(wallet);
    }
    
    @Override
    @Transactional
    public WalletResponseRecord addMoney(AddMoneyRecord dto) {
        Wallet wallet = walletRepository.findByUserId(dto.userId())
                .orElseGet(() -> createInitialWallet(dto.userId()));
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(dto.amount()));
        wallet.setTotalBalance(wallet.getTotalBalance().add(dto.amount()));
        Wallet updatedWallet = walletRepository.save(wallet);
        return walletMapper.toDto(updatedWallet);
    }

    @Override
    @Transactional
    public WalletResponseRecord withdrawMoney(AddMoneyRecord dto) {
        Wallet wallet = walletRepository.findByUserId(dto.userId())
                .orElseGet(() -> createInitialWallet(dto.userId()));

        if (wallet.getAvailableBalance().compareTo(dto.amount()) < 0) {
            throw new IllegalArgumentException("Insufficient available balance for withdrawal");
        }

        wallet.setAvailableBalance(wallet.getAvailableBalance().subtract(dto.amount()));
        wallet.setTotalBalance(wallet.getTotalBalance().subtract(dto.amount()));
        Wallet updatedWallet = walletRepository.save(wallet);
        return walletMapper.toDto(updatedWallet);
    }
    
    @Override
    public List<WalletTransactionResponseRecord> getWalletTransactions(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return walletTransactionRepository.getAllWalletTransactionsById(wallet.getId())
                .stream()
                .map(walletTransactionmapper::toDto)
                .toList();
    }
    
    private Wallet createInitialWallet(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Wallet newWallet = new Wallet();
        newWallet.setUser(user);
        return walletRepository.save(newWallet);
    }

}
