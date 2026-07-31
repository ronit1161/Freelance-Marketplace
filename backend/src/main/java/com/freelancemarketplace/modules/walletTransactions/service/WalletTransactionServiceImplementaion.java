package com.freelancemarketplace.modules.walletTransactions.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freelancemarketplace.common.exceptions.ResourceNotFoundException;
import com.freelancemarketplace.enums.ErrorCode;
import com.freelancemarketplace.enums.TransactionStatus;
import com.freelancemarketplace.enums.TransactionType;
import com.freelancemarketplace.modules.wallet.entity.Wallet;
import com.freelancemarketplace.modules.wallet.repository.WalletRepository;
import com.freelancemarketplace.modules.walletTransactions.entity.WalletTransaction;
import com.freelancemarketplace.modules.walletTransactions.exception.InsufficientBalanceException;
import com.freelancemarketplace.modules.walletTransactions.mapper.WalletTransactionmapper;
import com.freelancemarketplace.modules.walletTransactions.record.CreateWalletTransactionRecord;
import com.freelancemarketplace.modules.walletTransactions.record.WalletTransactionResponseRecord;
import com.freelancemarketplace.modules.walletTransactions.repository.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class WalletTransactionServiceImplementaion implements WalletTransactionService {

	private final WalletTransactionmapper walletTransactionmapper;
	private final WalletTransactionRepository walletTransactionRepository;
	private final WalletRepository walletRepository;
	
	//validate if available balance is sufficient
	private void validateSufficientAvailableBalance(Wallet wallet, BigDecimal amount) {
        if (wallet.getAvailableBalance() == null || wallet.getAvailableBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(wallet.getId());
        }
    }
	
	//validate if held balance is sufficient
	private void validateSufficientHeldBalance(Wallet wallet, BigDecimal amount) {
        if (wallet.getHeldBalance() == null || wallet.getHeldBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(wallet.getId());
        }
    }

	//to perform financial transactions on wallet including credit,debit,hold,release and transfer
		@Override
		@Transactional
		public WalletTransactionResponseRecord createWalletTransaction(CreateWalletTransactionRecord createWalletTransactionRecord) {

			WalletTransaction walletTransaction=walletTransactionmapper.toEntity(createWalletTransactionRecord);
			
			//for wallet credit transactions, ie,user adding to wallet
			if(createWalletTransactionRecord.destinationWalletId()==null&&createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.CREDIT) {
				Wallet wallet=walletRepository.findById(createWalletTransactionRecord.sourceWalletId()).
						orElseThrow(()-> new ResourceNotFoundException("wallet not found in databse",ErrorCode.WALLET_NOT_FOUND));
				
				wallet.setAvailableBalance(wallet.getAvailableBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
				
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
				
				//saving updated wallet details
				walletRepository.save(wallet);
			}
			
			//for wallet debit transactions, ie,user withdrawing from wallet
			if(createWalletTransactionRecord.sourceWalletId()==null&&createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.DEBIT) {
				Wallet wallet=walletRepository.findById(createWalletTransactionRecord.destinationWalletId()).
						orElseThrow(()-> new ResourceNotFoundException("wallet not found in databse",ErrorCode.WALLET_NOT_FOUND));
				
				wallet.setAvailableBalance(wallet.getAvailableBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
				
				//validating available balance
				validateSufficientAvailableBalance(wallet, createWalletTransactionRecord.createTransactionRecord().amount());
				
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
				
				//saving updated wallet details
				walletRepository.save(wallet);
			}
			
			//for wallet to wallet transactions
			if(Objects.nonNull(createWalletTransactionRecord.destinationWalletId())&&Objects.nonNull(createWalletTransactionRecord.sourceWalletId())) {//checking if both source and destination wallets are there
				Wallet destinationWallet=walletRepository.findById(createWalletTransactionRecord.destinationWalletId()).
						orElseThrow(()-> new ResourceNotFoundException("wallet not found in databse",ErrorCode.WALLET_NOT_FOUND));
				
				Wallet sourceWallet=walletRepository.findById(createWalletTransactionRecord.sourceWalletId()).
						orElseThrow(()-> new RuntimeException());
				
				//for eskrow hold transactions,funds held in source wallet
				if(createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.HOLD) {
					
					//validating balance
					validateSufficientAvailableBalance(sourceWallet, createWalletTransactionRecord.createTransactionRecord().amount());
					
					sourceWallet.setHeldBalance(sourceWallet.getHeldBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
					sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
					
				}
				
				//for eskrow release transactions,held funds are released to destination wallet
				if(createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.RELEASE) {
					
					//validating available balance
					validateSufficientHeldBalance(sourceWallet,createWalletTransactionRecord.createTransactionRecord().amount());
					
					sourceWallet.setHeldBalance(sourceWallet.getHeldBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					sourceWallet.setTotalBalance(sourceWallet.getTotalBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					destinationWallet.setHeldBalance(destinationWallet.getHeldBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					destinationWallet.setAvailableBalance(destinationWallet.getAvailableBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
				}
				
				//for eskrow refund transactions,held funds released back to source wallet
				if(createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.REFUND_ESKROW) {
					
					//validating balance
					validateSufficientHeldBalance(sourceWallet, createWalletTransactionRecord.createTransactionRecord().amount());
					
					sourceWallet.setHeldBalance(sourceWallet.getHeldBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
										
					walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
				}
				
				//for normal refund transactions,funds withdrawn from destination wallet and given back to source wallet
				if(createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.REFUND) {
					
					//validating balance
					validateSufficientAvailableBalance(destinationWallet, createWalletTransactionRecord.createTransactionRecord().amount());
					
					sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
					sourceWallet.setTotalBalance(sourceWallet.getTotalBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					destinationWallet.setAvailableBalance(destinationWallet.getAvailableBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					destinationWallet.setTotalBalance(destinationWallet.getTotalBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
					
				}
				
				//for normal transfer transactions,funds sent from source wallet to destination wallet
				if(createWalletTransactionRecord.createTransactionRecord().transactionType()==TransactionType.TRANSFER) {
					
					//validating balance
					validateSufficientAvailableBalance(sourceWallet, createWalletTransactionRecord.createTransactionRecord().amount());
					
					sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					sourceWallet.setTotalBalance(sourceWallet.getTotalBalance().subtract(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					destinationWallet.setAvailableBalance(destinationWallet.getAvailableBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
					destinationWallet.setTotalBalance(destinationWallet.getTotalBalance().add(createWalletTransactionRecord.createTransactionRecord().amount()));
					
					walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
				}	
				
				//saving updated wallet details
				walletRepository.save(sourceWallet);
				walletRepository.save(destinationWallet);
			}
			
			//saving wallet transaction details
			walletTransactionRepository.save(walletTransaction);
			
			return walletTransactionmapper.toDto(walletTransaction);
		}

		//for getting all transactions of a particular user
		@Transactional(readOnly = true)
		@Override
		public List<WalletTransactionResponseRecord> getAllWalletTransactionsById(Long walletId) {
			
			walletTransactionRepository.findById(walletId).orElseThrow(()-> new ResourceNotFoundException("wallet does not exist", ErrorCode.WALLET_NOT_FOUND));
				
			List<WalletTransactionResponseRecord> walletTransactionResponseRecords=walletTransactionRepository.getAllWalletTransactionsById(walletId).stream().map((walletTransactionmapper::toDto)).toList();
			
			return walletTransactionResponseRecords;
		}
		
}
