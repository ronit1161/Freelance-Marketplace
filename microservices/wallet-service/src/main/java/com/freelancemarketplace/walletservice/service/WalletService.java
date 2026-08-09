package com.freelancemarketplace.walletservice.service;

import com.freelancemarketplace.walletservice.dto.request.DepositRequest;
import com.freelancemarketplace.walletservice.dto.response.WalletResponse;
import com.freelancemarketplace.walletservice.dto.response.WalletTransactionResponse;

import java.util.List;

public interface WalletService {

    WalletResponse getOrCreateWallet(Long userId);

    WalletResponse getWalletByUserId(Long targetUserId, Long authenticatedUserId, String userRole);

    WalletResponse deposit(Long userId, DepositRequest request);

    List<WalletTransactionResponse> getTransactionsByUserId(Long userId);
}
