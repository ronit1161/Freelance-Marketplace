package com.freelancemarketplace.common.exceptions;

import org.springframework.http.HttpStatus;

import com.freelancemarketplace.enums.ErrorCode;

public class UnauthorizedAccessException extends BaseDomainException {

	private static final long serialVersionUID = 1L;

	public UnauthorizedAccessException(String message, ErrorCode errorCode) {
        super(message, errorCode, HttpStatus.FORBIDDEN);
    }

	public UnauthorizedAccessException(String message) {
        super(message, ErrorCode.UNAUTHORIZED_ACCESS, HttpStatus.FORBIDDEN);
    }
}
