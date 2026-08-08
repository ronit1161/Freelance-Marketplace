package com.freelancemarketplace.shared.dto;

public enum Role {
    ROLE_CLIENT,
    ROLE_FREELANCER,
    ROLE_ADMIN;

    public static Role fromString(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }
        String clean = roleStr.trim().toUpperCase();
        if (!clean.startsWith("ROLE_")) {
            clean = "ROLE_" + clean;
        }
        return Role.valueOf(clean);
    }
}
