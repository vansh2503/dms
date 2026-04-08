package com.dms.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;
    
    @NotNull(message = "Variant ID is required")
    @Positive(message = "Variant ID must be positive")
    private Long variantId;
    
    @NotNull(message = "Dealership ID is required")
    @Positive(message = "Dealership ID must be positive")
    private Long dealershipId;
    
    @NotNull(message = "Sales Executive ID is required")
    @Positive(message = "Sales Executive ID must be positive")
    private Long salesExecutiveId;
    
    @Positive(message = "Vehicle ID must be positive")
    private Long vehicleId;
    
    @NotNull(message = "Booking amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Booking amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Booking amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal bookingAmount;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Total amount must have at most 12 integer digits and 2 decimal places")
    private BigDecimal totalAmount;
    
    @NotNull(message = "Booking date is required")
    @PastOrPresent(message = "Booking date cannot be in the future")
    private LocalDate bookingDate;
    
    @Future(message = "Expected delivery date must be in the future")
    private LocalDate expectedDeliveryDate;
    
    @Size(max = 50, message = "Payment mode must not exceed 50 characters")
    private String paymentMode;
    
    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;
}
