package com.dms.demo.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class Customer360Response {
    private CustomerResponse customer;
    private List<BookingResponse> bookings;
    private List<TestDriveResponse> testDrives;
    private List<ExchangeResponse> exchangeRequests;
    private List<AccessoryOrderResponse> accessoryOrders;
    private CustomerStatistics statistics;
    
    @Data
    public static class CustomerStatistics {
        private Long totalBookings;
        private Long completedBookings;
        private Long cancelledBookings;
        private Long totalTestDrives;
        private Long totalExchangeRequests;
        private Long totalAccessoryOrders;
        private Integer totalLoyaltyPoints;
    }
}
