package com.dms.demo.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AccessoryOrderRequest {
    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private Long bookingId;

    @NotEmpty(message = "At least one accessory is required")
    @Valid
    private List<AccessoryOrderItem> accessories;

    private Boolean installationRequired;
    private LocalDate installationDate;

    @Data
    public static class AccessoryOrderItem {
        @NotNull(message = "Accessory ID is required")
        @Positive(message = "Accessory ID must be positive")
        private Long accessoryId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
