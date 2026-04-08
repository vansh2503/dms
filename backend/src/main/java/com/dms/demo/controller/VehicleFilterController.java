package com.dms.demo.controller;

import com.dms.demo.dto.filter.VehicleFilterDTO;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.dto.response.VehicleResponse;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.service.VehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Enhanced Vehicle Controller with advanced filtering capabilities
 * Endpoint: /api/vehicles/filter
 */
@Slf4j
@RestController
@RequestMapping("/api/vehicles/filter")
@RequiredArgsConstructor
public class VehicleFilterController {

    private final VehicleService vehicleService;

    /**
     * Advanced vehicle filtering with pagination
     * Example: GET /api/vehicles/filter?dealershipId=1&status=IN_SHOWROOM&color=Red&priceFrom=500000&priceTo=1000000&page=0&size=20&sort=sellingPrice&dir=asc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<VehicleResponse>>> filterVehicles(
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Integer manufacturingYear,
            @RequestParam(required = false) Integer manufacturingYearFrom,
            @RequestParam(required = false) Integer manufacturingYearTo,
            @RequestParam(required = false) BigDecimal priceFrom,
            @RequestParam(required = false) BigDecimal priceTo,
            @RequestParam(required = false) Long variantId,
            @RequestParam(required = false) Long modelId,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmissionType,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long stockyardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "vehicleId") String sort,
            @RequestParam(defaultValue = "asc") String dir) {

        log.info("=== FILTER REQUEST RECEIVED ===");
        log.info("Raw Parameters:");
        log.info("  model: {}", model);
        log.info("  fuelType: {}", fuelType);
        log.info("  transmissionType: {}", transmissionType);
        log.info("  fromDate: {}", fromDate);
        log.info("  toDate: {}", toDate);
        log.info("  status: {}", status);
        log.info("  page: {}, size: {}", page, size);

        VehicleFilterDTO filter = new VehicleFilterDTO();
        filter.setDealershipId(dealershipId);
        filter.setStatus(status);
        filter.setColor(color);
        filter.setManufacturingYear(manufacturingYear);
        filter.setManufacturingYearFrom(manufacturingYearFrom);
        filter.setManufacturingYearTo(manufacturingYearTo);
        filter.setPriceFrom(priceFrom);
        filter.setPriceTo(priceTo);
        filter.setVariantId(variantId);
        filter.setModelId(modelId);
        filter.setModel(model);
        filter.setSearch(search);
        filter.setStockyardId(stockyardId);
        
        // Parse enum values safely
        if (fuelType != null && !fuelType.trim().isEmpty()) {
            try {
                filter.setFuelType(com.dms.demo.enums.FuelType.valueOf(fuelType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid fuel type, ignore
            }
        }
        
        if (transmissionType != null && !transmissionType.trim().isEmpty()) {
            try {
                filter.setTransmissionType(com.dms.demo.enums.TransmissionType.valueOf(transmissionType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid transmission type, ignore
            }
        }
        
        // Parse dates safely
        if (fromDate != null && !fromDate.trim().isEmpty()) {
            try {
                filter.setFromDate(java.time.LocalDate.parse(fromDate));
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }
        
        if (toDate != null && !toDate.trim().isEmpty()) {
            try {
                filter.setToDate(java.time.LocalDate.parse(toDate));
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }

        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));

        log.info("Filter DTO created: {}", filter);
        log.info("=== END FILTER REQUEST ===");

        Page<VehicleResponse> result = vehicleService.findVehiclesWithFilters(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(result)));
    }

    /**
     * Advanced vehicle filtering without pagination
     * Example: GET /api/vehicles/filter/all?dealershipId=1&status=IN_SHOWROOM&color=Red
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> filterVehiclesAll(
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Integer manufacturingYear,
            @RequestParam(required = false) Integer manufacturingYearFrom,
            @RequestParam(required = false) Integer manufacturingYearTo,
            @RequestParam(required = false) BigDecimal priceFrom,
            @RequestParam(required = false) BigDecimal priceTo,
            @RequestParam(required = false) Long variantId,
            @RequestParam(required = false) Long modelId,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmissionType,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long stockyardId) {

        VehicleFilterDTO filter = new VehicleFilterDTO();
        filter.setDealershipId(dealershipId);
        filter.setStatus(status);
        filter.setColor(color);
        filter.setManufacturingYear(manufacturingYear);
        filter.setManufacturingYearFrom(manufacturingYearFrom);
        filter.setManufacturingYearTo(manufacturingYearTo);
        filter.setPriceFrom(priceFrom);
        filter.setPriceTo(priceTo);
        filter.setVariantId(variantId);
        filter.setModelId(modelId);
        filter.setModel(model);
        filter.setSearch(search);
        filter.setStockyardId(stockyardId);
        
        // Parse enum values safely
        if (fuelType != null && !fuelType.trim().isEmpty()) {
            try {
                filter.setFuelType(com.dms.demo.enums.FuelType.valueOf(fuelType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid fuel type, ignore
            }
        }
        
        if (transmissionType != null && !transmissionType.trim().isEmpty()) {
            try {
                filter.setTransmissionType(com.dms.demo.enums.TransmissionType.valueOf(transmissionType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid transmission type, ignore
            }
        }
        
        // Parse dates safely
        if (fromDate != null && !fromDate.trim().isEmpty()) {
            try {
                filter.setFromDate(java.time.LocalDate.parse(fromDate));
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }
        
        if (toDate != null && !toDate.trim().isEmpty()) {
            try {
                filter.setToDate(java.time.LocalDate.parse(toDate));
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }

        List<VehicleResponse> result = vehicleService.findVehiclesWithFilters(filter);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
