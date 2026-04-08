package com.dms.demo.controller;

import java.math.BigDecimal;
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

import com.dms.demo.dto.request.AccessoryRequest;
import com.dms.demo.dto.response.AccessoryResponse;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.service.AccessoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accessories")
@RequiredArgsConstructor
public class AccessoryController {

    private final AccessoryService accessoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<AccessoryResponse>> create(@Valid @RequestBody AccessoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(accessoryService.createAccessory(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(accessoryService.getAccessoryById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccessoryResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        // If any filter is provided, use the filter method
        if (search != null || category != null || minPrice != null || maxPrice != null) {
            return ResponseEntity.ok(ApiResponse.success(
                accessoryService.getAccessoriesWithFilters(search, category, minPrice, maxPrice)));
        }
        
        // Otherwise, return all accessories
        return ResponseEntity.ok(ApiResponse.success(accessoryService.getAllAccessories()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoryResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AccessoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(accessoryService.updateAccessory(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        accessoryService.deleteAccessory(id);
        return ResponseEntity.noContent().build();
    }
}
