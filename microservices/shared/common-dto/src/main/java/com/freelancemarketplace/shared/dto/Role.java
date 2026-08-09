package com.freelancemarketplace.shared.dto;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    ROLE_CLIENT,
    ROLE_FREELANCER,
    ROLE_ADMIN;

    @JsonCreator
    public static Role fromString(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return null;
        }
        String clean = roleStr.trim().toUpperCase();
        if (!clean.startsWith("ROLE_")) {
            clean = "ROLE_" + clean;
        }
        try {
            return Role.valueOf(clean);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: '" + roleStr + "'. Accepted values: CLIENT, FREELANCER, ADMIN (or ROLE_CLIENT, ROLE_FREELANCER, ROLE_ADMIN)");
        }
    }
}
