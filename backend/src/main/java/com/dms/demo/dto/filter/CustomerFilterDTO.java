package com.dms.demo.dto.filter;

import com.dms.demo.enums.CustomerType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerFilterDTO {
    private String search; // Name, email, phone
    private CustomerType customerType; // INDIVIDUAL, CORPORATE
    private String city;
    private String state;
    private LocalDate dobFrom;
    private LocalDate dobTo;
    private Integer loyaltyPointsFrom;
    private Integer loyaltyPointsTo;
    private Boolean isActive;
}
