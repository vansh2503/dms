package com.dms.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ExchangeRequestDto {
    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private Long bookingId;
    
    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;
    
    @NotBlank(message = "Old vehicle make is required")
    @Size(max = 50, message = "Old vehicle make must not exceed 50 characters")
    private String oldVehicleMake;
    
    @NotBlank(message = "Old vehicle model is required")
    @Size(max = 50, message = "Old vehicle model must not exceed 50 characters")
    private String oldVehicleModel;
    
    @Size(max = 50, message = "Old vehicle variant must not exceed 50 characters")
    private String oldVehicleVariant;
    
    @NotNull(message = "Old vehicle year is required")
    @Min(value = 1980, message = "Old vehicle year must be 1980 or later")
    @Max(value = 2100, message = "Old vehicle year must be 2100 or earlier")
    private Integer oldVehicleYear;
    
    @NotBlank(message = "Old vehicle registration is required")
    @Size(max = 20, message = "Old vehicle registration must not exceed 20 characters")
    @Pattern(regexp = "^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$", message = "Registration number must be in valid Indian format (e.g., KA01AB1234)")
    private String oldVehicleRegistration;
    
    @Min(value = 0, message = "Kilometers driven cannot be negative")
    @Max(value = 1000000, message = "Kilometers driven seems unrealistic")
    private Integer oldVehicleKmDriven;
    
    @Size(max = 50, message = "Old vehicle condition must not exceed 50 characters")
    private String oldVehicleCondition;
    
    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;
}
