package com.dms.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.request.DispatchRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.DispatchResponse;
import com.dms.demo.service.DispatchService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dispatch")
@RequiredArgsConstructor
public class DispatchController {

    private final DispatchService dispatchService;

    @PostMapping
    public ResponseEntity<ApiResponse<DispatchResponse>> dispatch(@Valid @RequestBody DispatchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dispatchService.dispatchVehicle(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DispatchResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dispatchService.getDispatchById(id)));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<DispatchResponse>> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success(dispatchService.getDispatchByBooking(bookingId)));
    }
}
