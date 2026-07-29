package com.freelancemarketplace.modules.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.modules.admin.record.GigSummaryRecord;
import com.freelancemarketplace.modules.admin.service.AdminGigService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/admin/gigs")
@RequiredArgsConstructor
public class AdminGigController {
    private final AdminGigService adminGigService;

    @GetMapping
    public ResponseEntity<List<GigSummaryRecord>> getAllGigs() {
        return ResponseEntity.ok(adminGigService.getAllGigs());
    }

}
