package com.freelancemarketplace.modules.gigs.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freelancemarketplace.modules.gigs.records.CreateGigRecord;
import com.freelancemarketplace.modules.gigs.records.GigResponseRecord;
import com.freelancemarketplace.modules.gigs.service.GigService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.freelancemarketplace.common.record.ApiResponse;
import com.freelancemarketplace.security.CustomUserDetails;

@RestController
@RequestMapping("/gigs")
@RequiredArgsConstructor
public class GigController {

    private final GigService gigService;

    // get all
    @GetMapping
    public ResponseEntity<ApiResponse<List<GigResponseRecord>>> getAllGigs() {
        return ResponseEntity.ok(ApiResponse.success(gigService.getAllGigs()));
    }

    // get by freelancer id
    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<ApiResponse<List<GigResponseRecord>>> getGigsByFreelancerId(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ApiResponse.success(gigService.getGigsByFreelancerId(freelancerId)));
    }

    // get by id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GigResponseRecord>> getGigById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(gigService.getGigById(id)));
    }

    // create gig
    @PostMapping
    public ResponseEntity<ApiResponse<GigResponseRecord>> createGig(
            @Valid @RequestBody CreateGigRecord dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        // Override freelancerId from JWT if authenticated to prevent IDOR
        Long effectiveFreelancerId = (userDetails != null) ? userDetails.getId() : dto.freelancerId();
        CreateGigRecord effectiveDto = new CreateGigRecord(
                dto.title(),
                dto.description(),
                dto.price(),
                dto.deliveryDays(),
                dto.thumbnailUrl(),
                effectiveFreelancerId,
                dto.categoryId()
        );

        GigResponseRecord createdGig = gigService.createGig(effectiveDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdGig, "Gig created successfully"));
    }

    // update gig
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GigResponseRecord>> updateGig(
            @PathVariable Long id,
            @Valid @RequestBody CreateGigRecord dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long effectiveFreelancerId = (userDetails != null) ? userDetails.getId() : dto.freelancerId();
        CreateGigRecord effectiveDto = new CreateGigRecord(
                dto.title(),
                dto.description(),
                dto.price(),
                dto.deliveryDays(),
                dto.thumbnailUrl(),
                effectiveFreelancerId,
                dto.categoryId()
        );

        GigResponseRecord updatedGig = gigService.updateGig(id, effectiveDto);
        return ResponseEntity.ok(ApiResponse.success(updatedGig, "Gig updated successfully"));
    }

    // soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGig(@PathVariable Long id) {
        gigService.deleteGig(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Gig deleted successfully"));
    }
}
