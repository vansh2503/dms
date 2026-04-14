package com.dms.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.request.VehicleRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.dto.response.StockyardVehicleGroupResponse;
import com.dms.demo.dto.response.VehicleResponse;
import com.dms.demo.entity.Vehicle;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.repository.VehicleRepository;
import com.dms.demo.service.VehicleService;
import com.dms.demo.util.VehicleMapper;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleRepository vehicleRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> add(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(vehicleService.addVehicle(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVehicleById(id)));
    }

    /**
     * GET /api/vehicles                                    â†’ all vehicles (existing)
     * GET /api/vehicles?dealershipId=1&status=IN_SHOWROOM  â†’ filtered list (existing)
     * GET /api/vehicles?page=0&size=20                     â†’ paginated, sorted by sellingPrice asc
     * GET /api/vehicles?page=0&size=20&sort=color&dir=desc â†’ paginated, sorted by color desc
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "sellingPrice") String sort,
            @RequestParam(required = false, defaultValue = "asc") String dir) {

        // Paginated path
        if (page != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));

            Page<Vehicle> vehiclePage;
            if (dealershipId != null && status != null) {
                vehiclePage = vehicleRepository.findByDealershipDealershipIdAndStatus(dealershipId, status, pageable);
            } else if (dealershipId != null) {
                vehiclePage = vehicleRepository.findByDealershipDealershipId(dealershipId, pageable);
            } else if (status != null) {
                vehiclePage = vehicleRepository.findByStatus(status, pageable);
            } else {
                vehiclePage = vehicleRepository.findAll(pageable);
            }

            PagedResponse<VehicleResponse> paged = PagedResponse.of(vehiclePage.map(VehicleMapper::toResponse));
            return ResponseEntity.ok(ApiResponse.success(paged));
        }

        // Legacy flat-list path (keeps existing frontend working)
        List<Vehicle> vehicles;
        if (search != null && !search.trim().isEmpty()) {
            vehicles = vehicleRepository.findWithFilters(search.trim(), dealershipId, status);
        } else if (dealershipId != null && status != null) {
            vehicles = vehicleRepository.findByDealershipDealershipIdAndStatus(dealershipId, status);
        } else if (dealershipId != null) {
            vehicles = vehicleRepository.findByDealershipDealershipId(dealershipId);
        } else if (status != null) {
            // Need to handle findByStatus because vehicleRepository.findByStatus without pageable is missing. 
            // Better to just use findWithFilters if status is present and no dealershipId.
            vehicles = vehicleRepository.findWithFilters(null, null, status);
        } else {
            vehicles = vehicleRepository.findAll();
        }

        if (color != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getColor().equalsIgnoreCase(color))
                    .collect(Collectors.toList());
        }
        if (year != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getManufacturingYear().equals(year))
                    .collect(Collectors.toList());
        }

        List<VehicleResponse> responses = vehicles.stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/dealership/{dealershipId}")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getByDealership(@PathVariable Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVehiclesByDealership(dealershipId)));
    }

    @GetMapping("/dealership/{dealershipId}/status/{status}")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getByStatus(
            @PathVariable Long dealershipId,
            @PathVariable VehicleStatus status) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVehiclesByStatus(dealershipId, status)));
    }

    @GetMapping("/stockyard")
    public ResponseEntity<ApiResponse<List<StockyardVehicleGroupResponse>>> getGroupedByStockyard(
            @RequestParam(required = false) Long dealershipId) {

        List<Vehicle> vehicles;
        if (dealershipId != null) {
            vehicles = vehicleRepository.findByDealershipDealershipId(dealershipId);
        } else {
            vehicles = vehicleRepository.findAll();
        }

        Map<Long, List<Vehicle>> groupedByStockyard = vehicles.stream()
                .filter(v -> v.getStockyard() != null)
                .collect(Collectors.groupingBy(v -> v.getStockyard().getStockyardId()));

        List<StockyardVehicleGroupResponse> response = new ArrayList<>();
        groupedByStockyard.forEach((stockyardId, vehicleList) -> {
            if (!vehicleList.isEmpty()) {
                var stockyard = vehicleList.get(0).getStockyard();
                List<VehicleResponse> vehicleResponses = vehicleList.stream()
                        .map(VehicleMapper::toResponse)
                        .collect(Collectors.toList());
                response.add(new StockyardVehicleGroupResponse(
                        stockyardId,
                        stockyard.getStockyardName(),
                        stockyard.getLocation(),
                        vehicleList.size(),
                        vehicleResponses
                ));
            }
        });

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam VehicleStatus status) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.updateVehicleStatus(id, status)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.updateVehicle(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
