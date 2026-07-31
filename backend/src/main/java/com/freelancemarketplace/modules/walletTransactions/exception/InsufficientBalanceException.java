package com.freelancemarketplace.modules.walletTransactions.exception;

import org.springframework.http.HttpStatus;

import com.freelancemarketplace.common.exceptions.BaseDomainException;
import com.freelancemarketplace.enums.ErrorCode;

public class InsufficientBalanceException extends BaseDomainException {

	private static final long serialVersionUID = -3762858621429151996L;

	public InsufficientBalanceException(Long walletId) {
		super("Insufficient balance in "+walletId, ErrorCode.INSUFFICIENT_BALANCE, HttpStatus.BAD_REQUEST);
	}

}
