package com.freelancemarketplace.shared.exception;

import org.springframework.http.HttpStatus;

public class AccountBlockedException extends ApiException {

    public AccountBlockedException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
