package com.freelancemarketplace.common.exceptions;

import org.springframework.http.HttpStatus;

import com.freelancemarketplace.enums.ErrorCode;

//Common Base Exception for all exceptions
public abstract class BaseDomainException extends RuntimeException{

	private static final long serialVersionUID = -5873858746279681497L;
	private final ErrorCode errorCode ;
    private final HttpStatus httpStatus;

    protected BaseDomainException(String message, ErrorCode errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
