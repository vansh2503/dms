package com.dms.demo.dto.response;

import com.dms.demo.enums.CustomerType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerResponse {
    private Long customerId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String alternatePhone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private LocalDate dateOfBirth;
    private LocalDate anniversaryDate;
    private String panNumber;
    private String aadharNumber;
    private String drivingLicense;
    private CustomerType customerType;
    private Integer loyaltyPoints;
    private String referredBy;
    private String notes;
}
