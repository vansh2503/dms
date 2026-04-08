package com.dms.demo.controller;

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

import com.dms.demo.dto.request.TestDriveRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.TestDriveResponse;
import com.dms.demo.enums.TestDriveStatus;
import com.dms.demo.service.TestDriveService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test-drives")
@RequiredArgsConstructor
public class TestDriveController {

    private final TestDriveService testDriveService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(testDriveService.getAllTestDrives()));
    }


    @PostMapping
    public ResponseEntity<ApiResponse<TestDriveResponse>> schedule(@Valid @RequestBody TestDriveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(testDriveService.scheduleTestDrive(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestDriveResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(testDriveService.getTestDriveById(id)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(testDriveService.getTestDrivesByCustomer(customerId)));
    }

    @GetMapping("/dealership/{dealershipId}")
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getByDealershipAndDate(
            @PathVariable Long dealershipId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(testDriveService.getTestDrivesByDealershipAndDate(dealershipId, date)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getByStatus(@PathVariable TestDriveStatus status) {
        return ResponseEntity.ok(ApiResponse.success(testDriveService.getTestDrivesByStatus(status)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TestDriveResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam TestDriveStatus status,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(ApiResponse.success(testDriveService.updateStatus(id, status, feedback)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        testDriveService.updateStatus(id, TestDriveStatus.CANCELLED, null);
        return ResponseEntity.noContent().build();
    }
}
