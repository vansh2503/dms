package com.dms.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VehicleRequest {
    @NotNull(message = "Variant ID is required")
    @Positive(message = "Variant ID must be positive")
    private Long variantId;
    
    @NotNull(message = "Dealership ID is required")
    @Positive(message = "Dealership ID must be positive")
    private Long dealershipId;
    
    @NotBlank(message = "VIN is required")
    @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    @Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$", message = "VIN must contain only valid characters (excluding I, O, Q)")
    private String vin;
    
    @NotBlank(message = "Chassis number is required")
    @Size(min = 10, max = 30, message = "Chassis number must be between 10 and 30 characters")
    private String chassisNumber;
    
    @NotBlank(message = "Engine number is required")
    @Size(min = 5, max = 30, message = "Engine number must be between 5 and 30 characters")
    private String engineNumber;
    
    @NotBlank(message = "Color is required")
    @Size(max = 30, message = "Color must not exceed 30 characters")
    private String color;
    
    @NotNull(message = "Manufacturing year is required")
    @Min(value = 2000, message = "Manufacturing year must be 2000 or later")
    @Max(value = 2100, message = "Manufacturing year must be 2100 or earlier")
    private Integer manufacturingYear;
    
    @NotNull(message = "Manufacturing month is required")
    @Min(value = 1, message = "Manufacturing month must be between 1 and 12")
    @Max(value = 12, message = "Manufacturing month must be between 1 and 12")
    private Integer manufacturingMonth;
    
    @Positive(message = "Stockyard ID must be positive")
    private Long stockyardId;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Purchase price must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Purchase price must have at most 12 integer digits and 2 decimal places")
    private BigDecimal purchasePrice;
    
    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Selling price must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Selling price must have at most 12 integer digits and 2 decimal places")
    private BigDecimal sellingPrice;
    
    @PastOrPresent(message = "Arrival date cannot be in the future")
    private LocalDate arrivalDate;
}
