package com.freelancemarketplace.modules.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.modules.admin.record.Graph;
import com.freelancemarketplace.modules.admin.service.DashboardService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/revenue")
    public ResponseEntity<List<Graph>> getRevenueGraph() {

        return ResponseEntity.ok(

                dashboardService.getRevenueGraph()

        );

    }

}
