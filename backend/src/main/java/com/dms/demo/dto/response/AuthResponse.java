package com.dms.demo.dto.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private Long userId;
    private Long dealershipId;
    private String fullName;

    public AuthResponse(String token, String username, String role, Long userId, Long dealershipId, String fullName) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.userId = userId;
        this.dealershipId = dealershipId;
        this.fullName = fullName;
    }
}
