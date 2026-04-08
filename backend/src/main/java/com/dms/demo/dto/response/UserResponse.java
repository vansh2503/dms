package com.dms.demo.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private Long dealershipId;
    private Boolean isActive;
}
