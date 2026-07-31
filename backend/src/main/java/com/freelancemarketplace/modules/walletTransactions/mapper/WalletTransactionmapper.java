package com.freelancemarketplace.modules.walletTransactions.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.transactions.mapper.TransactionMapper;
import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;
import com.freelancemarketplace.modules.walletTransactions.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;

@Mapper(componentModel = "spring",uses = { TransactionMapper.class })
public interface WalletTransactionmapper {
	
	//Wallet Transaction Entity to Response record for wallet transaction 
	@Mapping(target = "sourceWalletId",source = "sourceWallet.id")
	@Mapping(target = "destinationWalletId",source = "destinationWallet.id")
	WalletTransactionResponseRecord toDto(WalletTransaction entity);
	
	@Mapping(target = "id",ignore = true)
	@Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	@Mapping(source = "sourceWalletId", target = "sourceWallet.id")
    @Mapping(source = "destinationWalletId", target = "destinationWallet.id")
	@Mapping(source = "createTransactionRecord", target = "transaction")
	WalletTransaction toEntity(CreateWalletTransactionRecord dto);
}
