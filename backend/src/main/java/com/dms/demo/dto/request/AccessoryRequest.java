package com.dms.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccessoryRequest {
    @NotBlank(message = "Accessory name is required")
    @Size(min = 2, max = 100, message = "Accessory name must be between 2 and 100 characters")
    private String accessoryName;
    
    @NotBlank(message = "Accessory code is required")
    @Size(min = 2, max = 30, message = "Accessory code must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Accessory code must contain only uppercase letters, numbers, and hyphens")
    private String accessoryCode;
    
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal price;
}
