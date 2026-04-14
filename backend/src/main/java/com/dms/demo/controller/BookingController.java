package com.dms.demo.controller;

import com.dms.demo.dto.request.BookingCancellationRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dms.demo.dto.response.BookingResponse;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody com.dms.demo.dto.request.BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingById(id)));
    }

    @GetMapping("/number/{bookingNumber}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByNumber(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingByNumber(bookingNumber)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<java.util.List<BookingResponse>>> getBookingsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingsByCustomer(customerId)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam com.dms.demo.enums.BookingStatus status) {
        BookingResponse response = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", response));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingCancellationRequest request) {
        bookingService.cancelBooking(id, request.getCancellationReason());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully"));
    }
}
