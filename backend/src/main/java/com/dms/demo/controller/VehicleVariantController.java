package com.dms.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.request.VehicleVariantRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.VehicleVariantResponse;
import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;
import com.dms.demo.service.VehicleVariantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/variants")
@RequiredArgsConstructor
public class VehicleVariantController {

    private final VehicleVariantService variantService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleVariantResponse>> create(@Valid @RequestBody VehicleVariantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(variantService.createVariant(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleVariantResponse>> update(@PathVariable Long id, 
                                                         @Valid @RequestBody VehicleVariantRequest request) {
        return ResponseEntity.ok(ApiResponse.success(variantService.updateVariant(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleVariantResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(variantService.getVariantById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleVariantResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long modelId,
            @RequestParam(required = false) FuelType fuelType,
            @RequestParam(required = false) TransmissionType transmission) {
        
        // If any filter is provided, use the filter method
        if (search != null || modelId != null || fuelType != null || transmission != null) {
            return ResponseEntity.ok(ApiResponse.success(
                variantService.getVariantsWithFilters(search, modelId, fuelType, transmission)));
        }
        
        // Otherwise, return all variants
        return ResponseEntity.ok(ApiResponse.success(variantService.getAllVariants()));
    }

    @GetMapping("/model/{modelId}")
    public ResponseEntity<ApiResponse<List<VehicleVariantResponse>>> getByModel(@PathVariable Long modelId) {
        return ResponseEntity.ok(ApiResponse.success(variantService.getVariantsByModel(modelId)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VehicleVariantResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(variantService.getActiveVariants()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }
}
