package com.dms.demo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {
    SUPER_ADMIN,
    DEALER_MANAGER,
    SALES_EXECUTIVE,
    SENIOR_OFFICIAL;

    @JsonCreator
    public static UserRole fromString(String value) {
        if (value == null) return null;
        String normalized = value.toUpperCase().replace(" ", "_");
        switch (normalized) {
            case "ADMIN":           return SUPER_ADMIN;
            case "MANAGER":         return DEALER_MANAGER;
            case "SALES_EXECUTIVE": return SALES_EXECUTIVE;
            default:                return UserRole.valueOf(normalized);
        }
    }
}
