package com.freelancemarketplace.orderservice.client;

import com.freelancemarketplace.orderservice.client.dto.GigResponse;
import com.freelancemarketplace.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "gig-service", path = "/gigs")
public interface GigClient {

    @GetMapping("/{id}")
    ApiResponse<GigResponse> getGigById(@PathVariable("id") Long id);
}
