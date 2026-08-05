package com.freelancemarketplace.modules.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;
import com.freelancemarketplace.modules.admin.service.AdminGigService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/admin/gigs")
@RequiredArgsConstructor
public class AdminGigController {
    private final AdminGigService adminGigService;

    @GetMapping
    public ResponseEntity<List<GigSummaryRecord>> getAllGigs() {
        return ResponseEntity.ok(adminGigService.getAllGigs());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGig(@PathVariable Long id) {
        adminGigService.deleteGig(id);
        return ResponseEntity.noContent().build();
    }
}
