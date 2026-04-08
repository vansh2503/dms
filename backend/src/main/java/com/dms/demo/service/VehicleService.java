package com.dms.demo.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dms.demo.dto.filter.VehicleFilterDTO;
import com.dms.demo.dto.request.VehicleRequest;
import com.dms.demo.dto.response.VehicleResponse;
import com.dms.demo.enums.VehicleStatus;

public interface VehicleService {
    VehicleResponse addVehicle(VehicleRequest request);
    VehicleResponse getVehicleById(Long id);
    List<VehicleResponse> getVehiclesByDealership(Long dealershipId);
    List<VehicleResponse> getVehiclesByStatus(Long dealershipId, VehicleStatus status);
    VehicleResponse updateVehicleStatus(Long id, VehicleStatus status);
    VehicleResponse updateVehicle(Long id, VehicleRequest request);
    
    // Enhanced filtering methods
    Page<VehicleResponse> findVehiclesWithFilters(VehicleFilterDTO filter, Pageable pageable);
    List<VehicleResponse> findVehiclesWithFilters(VehicleFilterDTO filter);
    void deleteVehicle(Long id);
}
