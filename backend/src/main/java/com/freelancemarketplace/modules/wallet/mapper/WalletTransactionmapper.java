package com.freelancemarketplace.modules.wallet.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import com.freelancemarketplace.modules.wallet.record.WalletTransactionResponse;
import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;

@Mapper(componentModel = "spring")
public interface WalletTransactionmapper {
	
	@Mapping(target = "clientWalletId",source = "clientWallet.id")
	@Mapping(target = "freelancerWalletId",source = "freelancerWallet.id")
	WalletTransactionResponse toDto(WalletTransaction entity);
}
