package com.freelancemarketplace.gigservice.controller;

import com.freelancemarketplace.gigservice.dto.request.CreateGigRequest;
import com.freelancemarketplace.gigservice.dto.request.UpdateGigRequest;
import com.freelancemarketplace.gigservice.dto.response.GigResponse;
import com.freelancemarketplace.gigservice.service.GigService;
import com.freelancemarketplace.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/gigs")
@RequiredArgsConstructor
public class GigController {

    private final GigService gigService;

    @PostMapping
    public ResponseEntity<ApiResponse<GigResponse>> createGig(
            @Valid @RequestBody CreateGigRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received create gig request from user ID: {} with role: '{}'", authenticatedUserId, authenticatedUserRole);
        GigResponse response = gigService.createGig(request, authenticatedUserId, authenticatedUserRole);
        return new ResponseEntity<>(ApiResponse.success("Gig created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GigResponse>> getGigById(@PathVariable Long id) {
        log.info("Received request to fetch gig details for ID: {}", id);
        GigResponse response = gigService.getGigById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GigResponse>>> getAllGigs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy
    ) {
        log.info("Received request to browse gigs with category: {}, minPrice: {}, maxPrice: {}, search: '{}', sortBy: '{}'",
                categoryId, minPrice, maxPrice, search, sortBy);
        List<GigResponse> response = gigService.getAllGigs(categoryId, minPrice, maxPrice, search, sortBy);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<ApiResponse<List<GigResponse>>> getGigsByFreelancerId(@PathVariable Long freelancerId) {
        log.info("Received request to fetch gigs for freelancer ID: {}", freelancerId);
        List<GigResponse> response = gigService.getGigsByFreelancerId(freelancerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<GigResponse>>> getMyGigs(
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to fetch personal gigs for freelancer ID: {}", authenticatedUserId);
        List<GigResponse> response = gigService.getMyGigs(authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GigResponse>> updateGig(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGigRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to update Gig ID: {} by user ID: {}", id, authenticatedUserId);
        GigResponse response = gigService.updateGig(id, request, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Gig updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGig(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole
    ) {
        log.info("Received request to delete Gig ID: {} by user ID: {}", id, authenticatedUserId);
        gigService.deleteGig(id, authenticatedUserId, authenticatedUserRole);
        return ResponseEntity.ok(ApiResponse.success("Gig deleted successfully", null));
    }
}
