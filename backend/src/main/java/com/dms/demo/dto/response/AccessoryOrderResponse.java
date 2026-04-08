package com.dms.demo.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class AccessoryOrderResponse {
    private Long orderId;
    private Long bookingId;
    private String bookingNumber;
    private String customerName;
    private List<AccessoryOrderItemResponse> accessories;
    private BigDecimal totalAmount;
    private Boolean installationRequired;
    private LocalDate installationDate;
    private String status;
    
    @Data
    public static class AccessoryOrderItemResponse {
        private Long accessoryId;
        private String accessoryName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}
