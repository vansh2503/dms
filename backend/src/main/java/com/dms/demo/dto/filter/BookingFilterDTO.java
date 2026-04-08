package com.dms.demo.dto.filter;

import com.dms.demo.enums.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingFilterDTO {
    private Long dealershipId;
    private Long customerId;
    private Long salesExecutiveId;
    private BookingStatus status;
    private LocalDate bookingDateFrom;
    private LocalDate bookingDateTo;
    private LocalDate expectedDeliveryFrom;
    private LocalDate expectedDeliveryTo;
    private BigDecimal amountFrom;
    private BigDecimal amountTo;
    private String search; // Booking number, customer name
    private String paymentMode; // Payment mode filter
}
