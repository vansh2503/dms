package com.dms.demo.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DispatchRequest {
    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private Long bookingId;

    @NotNull(message = "Vehicle ID is required")
    @Positive(message = "Vehicle ID must be positive")
    private Long vehicleId;

    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;

    @NotNull(message = "Dispatched by user ID is required")
    @Positive(message = "Dispatched by user ID must be positive")
    private Long dispatchedById;

    @NotNull(message = "Dispatch date is required")
    private LocalDate dispatchDate;

    private LocalTime dispatchTime;

    @Size(max = 500, message = "Delivery location must not exceed 500 characters")
    private String deliveryLocation;

    private Integer odometerReading;

    @Size(max = 20, message = "Fuel level must not exceed 20 characters")
    private String fuelLevel;

    private Boolean documentsHandedOver;
    private Boolean keysHandedOver;
    private Boolean customerSignature;

    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;
}
