package com.dms.demo.controller;

import com.dms.demo.dto.request.DealershipRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.DealershipResponse;
import com.dms.demo.service.DealershipService;
import com.dms.demo.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dealerships")
@RequiredArgsConstructor
public class DealershipController {

    private final DealershipService dealershipService;
    private final AuditService auditService;

    @PostMapping
    public ResponseEntity<ApiResponse<DealershipResponse>> create(@Valid @RequestBody DealershipRequest request) {
        DealershipResponse response = dealershipService.createDealership(request);
        auditService.log("CREATE_DEALERSHIP", "Admin", "Created dealership: " + response.getDealershipName() + " (" + response.getDealershipCode() + ")");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DealershipResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dealershipService.getDealershipById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DealershipResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(dealershipService.getAllDealerships()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DealershipResponse>> update(@PathVariable Long id, @Valid @RequestBody DealershipRequest request) {
        DealershipResponse response = dealershipService.updateDealership(id, request);
        auditService.log("UPDATE_DEALERSHIP", "Admin", "Updated dealership ID: " + id + " - " + response.getDealershipName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dealershipService.deleteDealership(id);
        auditService.log("DELETE_DEALERSHIP", "Admin", "Deleted dealership ID: " + id);
        return ResponseEntity.noContent().build();
    }
}
