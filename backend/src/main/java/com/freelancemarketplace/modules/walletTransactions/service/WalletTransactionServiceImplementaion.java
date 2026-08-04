package com.freelancemarketplace.modules.walletTransactions.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freelancemarketplace.common.exceptions.ResourceNotFoundException;
import com.freelancemarketplace.common.exceptions.UnauthorizedAccessException;
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

		WalletTransaction walletTransaction = walletTransactionmapper.toEntity(createWalletTransactionRecord);
		TransactionType type = createWalletTransactionRecord.createTransactionRecord().transactionType();
		BigDecimal amount = createWalletTransactionRecord.createTransactionRecord().amount();

		// for wallet credit transactions, i.e., user adding to wallet
		if (type == TransactionType.CREDIT) {
			Long walletId = createWalletTransactionRecord.destinationWalletId() != null 
					? createWalletTransactionRecord.destinationWalletId() 
					: createWalletTransactionRecord.sourceWalletId();
			Wallet wallet = walletRepository.findById(walletId)
					.orElseThrow(() -> new ResourceNotFoundException("wallet not found in database", ErrorCode.WALLET_NOT_FOUND));
			
			wallet.setAvailableBalance(wallet.getAvailableBalance().add(amount));
			wallet.setTotalBalance(wallet.getTotalBalance().add(amount));
			
			walletTransaction.setDestinationWallet(wallet);
			walletTransaction.setSourceWallet(null);
			walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			
			walletRepository.save(wallet);
		}
		
		// for wallet debit transactions, i.e., user withdrawing from wallet
		if (type == TransactionType.DEBIT) {
			Long walletId = createWalletTransactionRecord.sourceWalletId() != null 
					? createWalletTransactionRecord.sourceWalletId() 
					: createWalletTransactionRecord.destinationWalletId();
			Wallet wallet = walletRepository.findById(walletId)
					.orElseThrow(() -> new ResourceNotFoundException("wallet not found in database", ErrorCode.WALLET_NOT_FOUND));
			
			validateSufficientAvailableBalance(wallet, amount);
			
			wallet.setAvailableBalance(wallet.getAvailableBalance().subtract(amount));
			wallet.setTotalBalance(wallet.getTotalBalance().subtract(amount));
			
			walletTransaction.setSourceWallet(wallet);
			walletTransaction.setDestinationWallet(null);
			walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			
			walletRepository.save(wallet);
		}
		
		// for wallet to wallet transactions (HOLD, RELEASE, REFUND_ESKROW, REFUND, TRANSFER)
		if (Objects.nonNull(createWalletTransactionRecord.destinationWalletId()) && Objects.nonNull(createWalletTransactionRecord.sourceWalletId())) {
			Wallet destinationWallet = walletRepository.findById(createWalletTransactionRecord.destinationWalletId())
					.orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found in database", ErrorCode.WALLET_NOT_FOUND));
			
			Wallet sourceWallet = walletRepository.findById(createWalletTransactionRecord.sourceWalletId())
					.orElseThrow(() -> new ResourceNotFoundException("Source wallet not found in database", ErrorCode.WALLET_NOT_FOUND));
			
			// for escrow hold transactions, funds held in source wallet
			if (type == TransactionType.HOLD) {
				validateSufficientAvailableBalance(sourceWallet, amount);
				
				sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().subtract(amount));
				sourceWallet.setHeldBalance(sourceWallet.getHeldBalance().add(amount));
				
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			}
			
			// for escrow release transactions, held funds in source wallet are released to destination wallet
			if (type == TransactionType.RELEASE) {
				validateSufficientHeldBalance(sourceWallet, amount);
				
				sourceWallet.setHeldBalance(sourceWallet.getHeldBalance().subtract(amount));
				sourceWallet.setTotalBalance(sourceWallet.getTotalBalance().subtract(amount));
				
				destinationWallet.setAvailableBalance(destinationWallet.getAvailableBalance().add(amount));
				destinationWallet.setTotalBalance(destinationWallet.getTotalBalance().add(amount));
				
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			}
			
			// for escrow refund transactions, held funds released back to available balance in source wallet
			if (type == TransactionType.REFUND_ESKROW) {
				validateSufficientHeldBalance(sourceWallet, amount);
				
				sourceWallet.setHeldBalance(sourceWallet.getHeldBalance().subtract(amount));
				sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().add(amount));
									
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			}
			
			// for normal refund transactions, funds withdrawn from destination wallet and given back to source wallet
			if (type == TransactionType.REFUND) {
				validateSufficientAvailableBalance(destinationWallet, amount);
				
				sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().add(amount));
				sourceWallet.setTotalBalance(sourceWallet.getTotalBalance().add(amount));
				
				destinationWallet.setAvailableBalance(destinationWallet.getAvailableBalance().subtract(amount));
				destinationWallet.setTotalBalance(destinationWallet.getTotalBalance().subtract(amount));
				
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			}
			
			// for normal transfer transactions, funds sent from source wallet to destination wallet
			if (type == TransactionType.TRANSFER) {
				validateSufficientAvailableBalance(sourceWallet, amount);
				
				sourceWallet.setAvailableBalance(sourceWallet.getAvailableBalance().subtract(amount));
				sourceWallet.setTotalBalance(sourceWallet.getTotalBalance().subtract(amount));
				
				destinationWallet.setAvailableBalance(destinationWallet.getAvailableBalance().add(amount));
				destinationWallet.setTotalBalance(destinationWallet.getTotalBalance().add(amount));
				
				walletTransaction.getTransaction().setTransactionStatus(TransactionStatus.SUCCESS);
			}	
			
			walletRepository.save(sourceWallet);
			walletRepository.save(destinationWallet);
		}
		
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

	@Transactional(readOnly = true)
	@Override
	public Page<WalletTransactionResponseRecord> getMyWalletTransactions(Long userId, Pageable pageable) {
		Wallet wallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId, ErrorCode.WALLET_NOT_FOUND));

		Page<WalletTransaction> transactionsPage = walletTransactionRepository.findByWalletId(wallet.getId(), pageable);
		return transactionsPage.map(walletTransactionmapper::toDto);
	}

	@Transactional(readOnly = true)
	@Override
	public WalletTransactionResponseRecord getWalletTransactionById(Long transactionId, Long userId) {
		Wallet userWallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId, ErrorCode.WALLET_NOT_FOUND));

		WalletTransaction walletTransaction = walletTransactionRepository.findByIdWithDetails(transactionId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet transaction not found with ID: " + transactionId, ErrorCode.TRANSACTION_NOT_FOUND));

		boolean isSourceOwner = walletTransaction.getSourceWallet() != null && Objects.equals(walletTransaction.getSourceWallet().getId(), userWallet.getId());
		boolean isDestinationOwner = walletTransaction.getDestinationWallet() != null && Objects.equals(walletTransaction.getDestinationWallet().getId(), userWallet.getId());

		if (!isSourceOwner && !isDestinationOwner) {
			throw new UnauthorizedAccessException("You do not have permission to view this wallet transaction");
		}

		return walletTransactionmapper.toDto(walletTransaction);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<WalletTransactionResponseRecord> getAllWalletTransactionsAdmin(TransactionType type, TransactionStatus status, String search, Pageable pageable) {
		String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
		Page<WalletTransaction> page = walletTransactionRepository.findAllAdmin(type, status, cleanSearch, pageable);
		return page.map(walletTransactionmapper::toDto);
	}

	@Transactional(readOnly = true)
	@Override
	public WalletTransactionResponseRecord getWalletTransactionByIdAdmin(Long transactionId) {
		WalletTransaction walletTransaction = walletTransactionRepository.findByIdWithDetails(transactionId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet transaction not found with ID: " + transactionId, ErrorCode.TRANSACTION_NOT_FOUND));

		return walletTransactionmapper.toDto(walletTransaction);
	}
}
