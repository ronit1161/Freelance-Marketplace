package com.freelancemarketplace.authservice.client;

import com.freelancemarketplace.shared.dto.ApiResponse;
import com.freelancemarketplace.shared.dto.InitializeProfileRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service", path = "/users")
public interface UserClient {

    @PostMapping("/internal/init")
    ApiResponse<?> initializeProfile(@RequestBody InitializeProfileRequest request);
}
