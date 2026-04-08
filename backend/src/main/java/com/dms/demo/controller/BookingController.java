package com.dms.demo.controller;

import com.dms.demo.dto.request.BookingCancellationRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingCancellationRequest request) {
        bookingService.cancelBooking(id, request.getCancellationReason());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully"));
    }
}
