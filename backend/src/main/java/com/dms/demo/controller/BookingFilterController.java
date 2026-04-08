package com.dms.demo.controller;

import com.dms.demo.dto.filter.BookingFilterDTO;
import com.dms.demo.dto.request.BookingCancellationRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.BookingResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.enums.BookingStatus;
import com.dms.demo.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Enhanced Booking Controller with advanced filtering capabilities
 * Endpoint: /api/bookings/filter
 */
@RestController
@RequestMapping("/api/bookings/filter")
@RequiredArgsConstructor
public class BookingFilterController {

    private final BookingService bookingService;

    /**
     * Advanced booking filtering with pagination
     * Example: GET /api/bookings/filter?dealershipId=1&status=CONFIRMED&bookingDateFrom=2024-01-01&bookingDateTo=2024-12-31&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> filterBookings(
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long salesExecutiveId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedDeliveryFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedDeliveryTo,
            @RequestParam(required = false) BigDecimal amountFrom,
            @RequestParam(required = false) BigDecimal amountTo,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "bookingDate") String sort,
            @RequestParam(defaultValue = "desc") String dir) {

        BookingFilterDTO filter = new BookingFilterDTO();
        filter.setDealershipId(dealershipId);
        filter.setCustomerId(customerId);
        filter.setSalesExecutiveId(salesExecutiveId);
        filter.setStatus(status);
        filter.setBookingDateFrom(bookingDateFrom);
        filter.setBookingDateTo(bookingDateTo);
        filter.setExpectedDeliveryFrom(expectedDeliveryFrom);
        filter.setExpectedDeliveryTo(expectedDeliveryTo);
        filter.setAmountFrom(amountFrom);
        filter.setAmountTo(amountTo);
        filter.setSearch(search);
        filter.setPaymentMode(paymentMode);

        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));

        Page<BookingResponse> result = bookingService.findBookingsWithFilters(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(result)));
    }

    /**
     * Advanced booking filtering without pagination
     * Example: GET /api/bookings/filter/all?dealershipId=1&status=CONFIRMED
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> filterBookingsAll(
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long salesExecutiveId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedDeliveryFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedDeliveryTo,
            @RequestParam(required = false) BigDecimal amountFrom,
            @RequestParam(required = false) BigDecimal amountTo,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String paymentMode) {

        BookingFilterDTO filter = new BookingFilterDTO();
        filter.setDealershipId(dealershipId);
        filter.setCustomerId(customerId);
        filter.setSalesExecutiveId(salesExecutiveId);
        filter.setStatus(status);
        filter.setBookingDateFrom(bookingDateFrom);
        filter.setBookingDateTo(bookingDateTo);
        filter.setExpectedDeliveryFrom(expectedDeliveryFrom);
        filter.setExpectedDeliveryTo(expectedDeliveryTo);
        filter.setAmountFrom(amountFrom);
        filter.setAmountTo(amountTo);
        filter.setSearch(search);
        filter.setPaymentMode(paymentMode);

        List<BookingResponse> result = bookingService.findBookingsWithFilters(filter);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
