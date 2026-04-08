package com.dms.demo.dto.response;

import lombok.Data;

@Data
public class DealershipResponse {
    private Long dealershipId;
    private String dealershipCode;
    private String dealershipName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String email;
    private String managerName;
    private Boolean isActive;
}
