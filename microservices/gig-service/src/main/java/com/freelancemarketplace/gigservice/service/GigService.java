package com.freelancemarketplace.gigservice.service;

import com.freelancemarketplace.gigservice.dto.request.CreateGigRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateGigRequest;
import com.freelancemarketplace.gigservice.dto.response.GigResponse;

import java.math.BigDecimal;
import java.util.List;

public interface GigService {

    GigResponse createGig(CreateGigRequest request, Long authenticatedUserId, String userRole);

    GigResponse getGigById(Long id);

    List<GigResponse> getAllGigs(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String search, String sortBy);

    List<GigResponse> getGigsByFreelancerId(Long freelancerId);

    List<GigResponse> getMyGigs(Long authenticatedUserId, String userRole);

    GigResponse updateGig(Long id, UpdateGigRequest request, Long authenticatedUserId, String userRole);

    void deleteGig(Long id, Long authenticatedUserId, String userRole);
}
