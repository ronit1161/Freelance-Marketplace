package com.freelancemarketplace.modules.wallet.service;

import java.util.List;

import com.freelancemarketplace.modules.wallet.record.AddMoneyRecord;
import com.freelancemarketplace.modules.wallet.record.WalletResponseRecord;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;

public interface WalletService {

	WalletResponseRecord getWalletByUserId(Long userId);
    WalletResponseRecord addMoney(AddMoneyRecord dto);
    WalletResponseRecord withdrawMoney(AddMoneyRecord dto);
    List<WalletTransactionResponseRecord> getWalletTransactions(Long userId);
	
}
