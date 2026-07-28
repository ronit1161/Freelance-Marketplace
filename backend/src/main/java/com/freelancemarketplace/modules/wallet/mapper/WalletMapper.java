package com.freelancemarketplace.modules.wallet.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.modules.wallet.entity.Wallet;
import com.freelancemarketplace.modules.wallet.record.WalletResponseRecord;
@Mapper(componentModel = "spring")
public interface WalletMapper {
	
	@Mapping(target = "userId",source = "user.id")
	WalletResponseRecord toDto(Wallet entity);
}
