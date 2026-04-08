package com.dms.demo.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.request.ExchangeRequestDto;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.ExchangeResponse;
import com.dms.demo.enums.ExchangeStatus;
import com.dms.demo.service.ExchangeRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/exchange")
@RequiredArgsConstructor
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExchangeResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ExchangeStatus status,
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        // If any filter is provided, use the filter method
        if (search != null || status != null || vehicleId != null || fromDate != null || toDate != null) {
            List<ExchangeResponse> result = exchangeRequestService.getExchangesWithFilters(
                search, status, vehicleId, fromDate, toDate);
            log.info("GET /api/exchange with filters -> {} records", result.size());
            return ResponseEntity.ok(ApiResponse.success(result));
        }
        
        // Otherwise, return all exchanges
        List<ExchangeResponse> result = exchangeRequestService.getAllExchanges();
        log.info("GET /api/exchange -> {} records", result.size());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExchangeResponse>> create(@Valid @RequestBody ExchangeRequestDto request) {
        log.info("POST /api/exchange -> bookingId={}, customerId={}", request.getBookingId(), request.getCustomerId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(exchangeRequestService.createExchangeRequest(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExchangeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(exchangeRequestService.getExchangeById(id)));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<ExchangeResponse>>> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success(exchangeRequestService.getExchangesByBooking(bookingId)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<ExchangeResponse>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(exchangeRequestService.getExchangesByCustomer(customerId)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ExchangeResponse>>> getByStatus(@PathVariable ExchangeStatus status) {
        return ResponseEntity.ok(ApiResponse.success(exchangeRequestService.getExchangesByStatus(status)));
    }

    @PatchMapping("/{id}/evaluate")
    public ResponseEntity<ApiResponse<ExchangeResponse>> evaluate(
            @PathVariable Long id,
            @RequestParam BigDecimal offeredAmount) {
        log.info("PATCH /api/exchange/{}/evaluate -> offeredAmount={}", id, offeredAmount);
        return ResponseEntity.ok(ApiResponse.success(exchangeRequestService.evaluateExchange(id, offeredAmount)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ExchangeResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam ExchangeStatus status) {
        log.info("PATCH /api/exchange/{}/status -> status={}", id, status);
        return ResponseEntity.ok(ApiResponse.success(exchangeRequestService.updateStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Soft-delete: marks exchange request as REJECTED
        exchangeRequestService.updateStatus(id, ExchangeStatus.REJECTED);
        return ResponseEntity.noContent().build();
    }
}
