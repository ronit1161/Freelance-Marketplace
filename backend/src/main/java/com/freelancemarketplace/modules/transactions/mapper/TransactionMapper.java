package com.freelancemarketplace.modules.transactions.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.freelancemarketplace.entitiy.Transaction;
import com.freelancemarketplace.modules.transactions.records.CreateTransactionRecord;
import com.freelancemarketplace.modules.transactions.records.TransactionResponseRecord;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

	@Mapping(target = "id", ignore = true)
    @Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	Transaction toEntity(CreateTransactionRecord dto);
	
	TransactionResponseRecord toDto(Transaction entity);
}
