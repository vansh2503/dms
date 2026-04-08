package com.dms.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.request.SalesTransactionRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.dto.response.SalesTransactionResponse;
import com.dms.demo.service.SalesTransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesTransactionController {

    private final SalesTransactionService salesTransactionService;

    /**
     * GET /api/sales                                       â†’ paginated, default page=0 size=20 sort=saleDate desc
     * GET /api/sales?page=1&size=10&sort=totalAmount&dir=desc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<SalesTransactionResponse>>> getAll(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "saleDate") String sort,
            @RequestParam(required = false, defaultValue = "desc") String dir) {

        Sort.Direction direction = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.getAllTransactionsPaged(pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalesTransactionResponse>> create(@Valid @RequestBody SalesTransactionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.createTransaction(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesTransactionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.getTransactionById(id)));
    }

    /**
     * GET /api/sales/dealership/{id}?page=0&size=10&sort=saleDate&dir=desc
     */
    @GetMapping("/dealership/{dealershipId}")
    public ResponseEntity<?> getByDealership(
            @PathVariable Long dealershipId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "saleDate") String sort,
            @RequestParam(required = false, defaultValue = "desc") String dir) {

        if (page != null) {
            Sort.Direction direction = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
            return ResponseEntity.ok(ApiResponse.success(
                    salesTransactionService.getTransactionsByDealershipPaged(dealershipId, pageable)));
        }
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.getTransactionsByDealership(dealershipId)));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<SalesTransactionResponse>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.getTransactionsByDateRange(from, to)));
    }
}
