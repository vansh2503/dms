package com.dms.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingReportResponse {
    private Integer totalBookings;
    private Integer confirmedBookings;
    private Integer pendingBookings;
    private Integer cancelledBookings;
    private Integer deliveredBookings;
    private BigDecimal totalBookingAmount;
    private BigDecimal totalCancellationCharges;
    private List<BookingResponse> bookings;
}
