package com.freelancemarketplace.common.exceptions;

import org.springframework.http.HttpStatus;

import com.freelancemarketplace.enums.ErrorCode;

//exception for http status code 404 resource not found
public class ResourceNotFoundException extends BaseDomainException {

	private static final long serialVersionUID = 890942897952990755L;

	public ResourceNotFoundException(String message, ErrorCode errorCode) {
        super(message, errorCode, HttpStatus.NOT_FOUND);
    }
}
