package modules.transactions.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import entities.Transaction;
import modules.transactions.records.CreateTransactionRecord;
import modules.transactions.records.TransactionResponseRecord;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

	@Mapping(target = "id", ignore = true)
    @Mapping(target = "createdOn",ignore = true)
	@Mapping(target = "lastUpdated",ignore = true)
	Transaction toEntity(CreateTransactionRecord dto);
	
	TransactionResponseRecord toDto(Transaction entity);
}
