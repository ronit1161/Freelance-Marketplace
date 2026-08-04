package com.freelancemarketplace.common.logger.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import com.freelancemarketplace.common.logger.service.LoggerServiceClient;

@Component
@Aspect
public class LoggingAspect {

    private final LoggerServiceClient logger;

    public LoggingAspect(LoggerServiceClient logger) {
        this.logger = logger;
    }

    // Before API Call
    @Before("execution(* com.freelancemarketplace.modules..controller.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        String method = joinPoint.getSignature().toShortString();
        logger.sendLog("API Called: " + method, "INFO");
    }

    // on success
    @AfterReturning("execution(* com.freelancemarketplace.modules..controller.*.*(..))")
    public void logAfterSuccess(JoinPoint joinPoint) {
        String method = joinPoint.getSignature().toShortString();
        logger.sendLog("API Success: " + method, "INFO");
    }

    //  on exception
    @AfterThrowing(
        pointcut = "execution(* com.freelancemarketplace.modules..controller.*.*(..))",
        throwing = "ex"
    )
    public void logAfterError(JoinPoint joinPoint, Exception ex) {
        String method = joinPoint.getSignature().toShortString();
        logger.sendLog("API Error: " + method + " - " + ex.getMessage(), "ERROR");
    }
}
