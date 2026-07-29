package com.freelancemarketplace.modules.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancemarketplace.modules.admin.record.UserSummaryRecord;
import com.freelancemarketplace.modules.admin.service.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<UserSummaryRecord>> getAllUsers() {

        return ResponseEntity.ok(
                adminUserService.getAllUsers());
    }

}
