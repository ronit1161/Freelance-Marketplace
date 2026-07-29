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

@RestController
@RequestMapping("/gigs")
@RequiredArgsConstructor
public class GigController {

    private final GigService gigService;

    // get all
    @GetMapping
    public ResponseEntity<List<GigResponseRecord>> getAllGigs() {
        return ResponseEntity.ok(gigService.getAllGigs());
    }

    // get by id
    @GetMapping("/{id}")
    public ResponseEntity<GigResponseRecord> getGigById(@PathVariable Long id) {
        return ResponseEntity.ok(gigService.getGigById(id));
    }

    // create gig
    @PostMapping
    public ResponseEntity<GigResponseRecord> createGig(
            @Valid @RequestBody CreateGigRecord dto) {

        GigResponseRecord createdGig = gigService.createGig(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdGig);
    }

    // update gig
    @PutMapping("/{id}")
    public ResponseEntity<GigResponseRecord> updateGig(
            @PathVariable Long id,
            @Valid @RequestBody CreateGigRecord dto) {

        GigResponseRecord updatedGig = gigService.updateGig(id, dto);

        return ResponseEntity.ok(updatedGig);
    }

    // soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGig(@PathVariable Long id) {
        gigService.deleteGig(id);
        return ResponseEntity.noContent().build();
    }
}
