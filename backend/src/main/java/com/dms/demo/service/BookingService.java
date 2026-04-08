package com.dms.demo.service;

import com.dms.demo.dto.filter.BookingFilterDTO;
import com.dms.demo.dto.request.BookingRequest;
import com.dms.demo.dto.response.BookingResponse;
import com.dms.demo.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request);

    BookingResponse getBookingById(Long id);

    BookingResponse getBookingByNumber(String bookingNumber);

    List<BookingResponse> getBookingsByCustomer(Long customerId);

    List<BookingResponse> getBookingsByDealership(Long dealershipId, BookingStatus status);

    BookingResponse updateBookingStatus(Long id, BookingStatus status);

    void cancelBooking(Long id, String reason);
    
    // Enhanced filtering methods
    Page<BookingResponse> findBookingsWithFilters(BookingFilterDTO filter, Pageable pageable);
    List<BookingResponse> findBookingsWithFilters(BookingFilterDTO filter);
}
