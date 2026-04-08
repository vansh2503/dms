package com.dms.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TestDriveRequest {
    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;
    
    @NotNull(message = "Vehicle ID is required")
    @Positive(message = "Vehicle ID must be positive")
    private Long vehicleId;
    
    @NotNull(message = "Dealership ID is required")
    @Positive(message = "Dealership ID must be positive")
    private Long dealershipId;
    
    @NotNull(message = "Sales Executive ID is required")
    @Positive(message = "Sales Executive ID must be positive")
    private Long salesExecutiveId;
    
    @NotNull(message = "Scheduled date is required")
    @FutureOrPresent(message = "Scheduled date must be today or in the future")
    private LocalDate scheduledDate;
    
    @NotNull(message = "Scheduled time is required")
    private LocalTime scheduledTime;
}
