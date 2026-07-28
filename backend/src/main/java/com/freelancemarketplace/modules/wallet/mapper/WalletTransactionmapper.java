package com.freelancemarketplace.modules.wallet.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

<<<<<<< HEAD

import com.freelancemarketplace.modules.wallet.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;
=======
import com.freelancemarketplace.entity.WalletTransaction;
import com.freelancemarketplace.modules.wallet.record.WalletTransactionResponse;

>>>>>>> e11697e (completed transcation and review records)

@Mapper(componentModel = "spring")
public interface WalletTransactionmapper {
	
	@Mapping(target = "clientWalletId",source = "clientWallet.id")
	@Mapping(target = "freelancerWalletId",source = "freelancerWallet.id")
	@Mapping(target = "transaction",source = "transaction")
	WalletTransactionResponse toDto(WalletTransaction entity);
}
