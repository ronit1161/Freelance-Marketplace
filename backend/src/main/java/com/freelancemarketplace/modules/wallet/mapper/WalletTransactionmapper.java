package com.freelancemarketplace.modules.wallet.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import com.freelancemarketplace.modules.wallet.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;

@Mapper(componentModel = "spring")
public interface WalletTransactionmapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	WalletTransaction toEntity(CreateWalletTransactionRecord dto);
}
