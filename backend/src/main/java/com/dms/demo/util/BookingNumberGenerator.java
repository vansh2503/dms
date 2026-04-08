package com.dms.demo.util;

import org.springframework.stereotype.Component;

import java.time.Year;

@Component
public class BookingNumberGenerator {

    public String generateBookingNumber(Long sequenceNumber) {
        int currentYear = Year.now().getValue();
        return String.format("HYN-%d-%04d", currentYear, sequenceNumber);
    }
}
