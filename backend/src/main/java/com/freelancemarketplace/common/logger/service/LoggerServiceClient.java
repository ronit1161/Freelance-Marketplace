package com.freelancemarketplace.common.logger.service;

import com.freelancemarketplace.common.logger.logrequest.LogRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// this service sends all log details from java to .net logger
@Service
public class LoggerServiceClient {

    private final String LOGGER_URL = "http://localhost:5090/api/log"; // your .net API

    public void sendLog(String message, String level) {
        RestTemplate restTemplate = new RestTemplate();

        LogRequest request = new LogRequest();
        request.setMessage(message);
        request.setLevel(level);
        request.setService("JavaApp");

        restTemplate.postForObject(LOGGER_URL, request, String.class);
    }
}
