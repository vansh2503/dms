package com.dms.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingResponse {
    private Long bookingId;
    private String bookingNumber;
    private String customerName;
    private String vehicleModel;
    private String variantName;
    private String dealershipName;
    private String salesExecutiveName;
    private BigDecimal bookingAmount;
    private BigDecimal totalAmount;
    private LocalDate bookingDate;
    private LocalDate expectedDeliveryDate;
    private String status;
    private String paymentMode;
    private String remarks;
}
