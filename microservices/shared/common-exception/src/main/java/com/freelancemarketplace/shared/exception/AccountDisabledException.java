package com.freelancemarketplace.shared.exception;

import org.springframework.http.HttpStatus;

public class AccountDisabledException extends ApiException {

    public AccountDisabledException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
