package com.dms.demo.dto.request;

import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class VehicleVariantRequest {
    @NotNull(message = "Model ID is required")
    @Positive(message = "Model ID must be positive")
    private Long modelId;
    
    @NotBlank(message = "Variant name is required")
    @Size(min = 2, max = 100, message = "Variant name must be between 2 and 100 characters")
    private String variantName;
    
    @NotBlank(message = "Variant code is required")
    @Size(min = 2, max = 30, message = "Variant code must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Variant code must contain only uppercase letters, numbers, and hyphens")
    private String variantCode;
    
    @NotNull(message = "Fuel type is required")
    private FuelType fuelType;
    
    @NotNull(message = "Transmission type is required")
    private TransmissionType transmission;
    
    @Size(max = 20, message = "Engine capacity must not exceed 20 characters")
    private String engineCapacity;
    
    @Size(max = 50, message = "Max power must not exceed 50 characters")
    private String maxPower;
    
    @Size(max = 50, message = "Max torque must not exceed 50 characters")
    private String maxTorque;
    
    @Min(value = 2, message = "Seating capacity must be at least 2")
    @Max(value = 20, message = "Seating capacity must not exceed 20")
    private Integer seatingCapacity;
    
    @Size(max = 20, message = "Ground clearance must not exceed 20 characters")
    private String groundClearance;
    
    @Size(max = 20, message = "Boot space must not exceed 20 characters")
    private String bootSpace;
    
    @Min(value = 0, message = "Airbags count cannot be negative")
    @Max(value = 20, message = "Airbags count must not exceed 20")
    private Integer airbags;
    
    @Size(max = 30, message = "ARAI mileage must not exceed 30 characters")
    private String araiMileage;
    
    @Size(max = 2000, message = "Features must not exceed 2000 characters")
    private String features;
    
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Base price must have at most 12 integer digits and 2 decimal places")
    private BigDecimal basePrice;
    
    @NotNull(message = "Ex-showroom price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Ex-showroom price must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Ex-showroom price must have at most 12 integer digits and 2 decimal places")
    private BigDecimal exShowroomPrice;
}
