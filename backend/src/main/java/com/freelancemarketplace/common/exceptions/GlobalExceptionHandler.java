package com.freelancemarketplace.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.freelancemarketplace.modules.walletTransactions.exception.InsufficientBalanceException;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	//Handling Resource Not Found Exception
	@ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                ex.getHttpStatus(), 
                ex.getMessage()
        );
        
        problemDetail.setTitle("Resource Not Found");
        problemDetail.setType(URI.create("https://api.yourdomain.com/errors/not-found"));
        problemDetail.setProperty("timestamp", Instant.now()); // Adding custom key-values
        problemDetail.setProperty("errorCode",ex.getErrorCode().toString());
        return problemDetail;
    }
	
	//Handling Insufficient Balance Error
	@ExceptionHandler(InsufficientBalanceException.class)
    public ProblemDetail hanldeInsufficientBalance(ResourceNotFoundException ex, WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                ex.getHttpStatus(), 
                ex.getMessage()
        );
        
        problemDetail.setTitle("Resource Not Found");
        problemDetail.setType(URI.create("https://api.yourdomain.com/errors/not-found"));
        problemDetail.setProperty("timestamp", Instant.now()); // Adding custom key-values
        problemDetail.setProperty("errorCode",ex.getErrorCode().toString());
        return problemDetail;
    }

    //Handling Validation Errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationExceptions(MethodArgumentNotValidException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, 
                "Validation failed for request parameters"
        );

        problemDetail.setTitle("Invalid Request Parameters");
        problemDetail.setType(URI.create("https://api.yourdomain.com/errors/bad-request"));

        // Extract field validation errors
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        // Standard way in RFC 7807 to attach extra properties
        problemDetail.setProperty("invalidParams", fieldErrors);
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }
}
