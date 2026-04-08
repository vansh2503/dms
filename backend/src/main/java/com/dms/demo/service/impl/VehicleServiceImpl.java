package com.dms.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dms.demo.dto.filter.VehicleFilterDTO;
import com.dms.demo.dto.request.VehicleRequest;
import com.dms.demo.dto.response.VehicleResponse;
import com.dms.demo.entity.Dealership;
import com.dms.demo.entity.Stockyard;
import com.dms.demo.entity.Vehicle;
import com.dms.demo.entity.VehicleVariant;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.DealershipRepository;
import com.dms.demo.repository.StockyardRepository;
import com.dms.demo.repository.VehicleRepository;
import com.dms.demo.repository.VehicleVariantRepository;
import com.dms.demo.repository.specification.VehicleSpecification;
import com.dms.demo.service.VehicleService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleVariantRepository variantRepository;
    private final DealershipRepository dealershipRepository;
    private final StockyardRepository stockyardRepository;

    @Override
    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public VehicleResponse addVehicle(VehicleRequest request) {
        log.info("Adding new vehicle: VIN={}", request.getVin());
        
        if (vehicleRepository.findByVin(request.getVin()).isPresent()) {
            throw new BadRequestException("Vehicle with VIN " + request.getVin() + " already exists");
        }

        if (vehicleRepository.findByChassisNumber(request.getChassisNumber()).isPresent()) {
            throw new BadRequestException("Vehicle with chassis number " + request.getChassisNumber() + " already exists");
        }

        VehicleVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));

        Vehicle vehicle = new Vehicle();
        vehicle.setVariant(variant);
        vehicle.setDealership(dealership);
        vehicle.setVin(request.getVin());
        vehicle.setChassisNumber(request.getChassisNumber());
        vehicle.setEngineNumber(request.getEngineNumber());
        vehicle.setColor(request.getColor());
        vehicle.setManufacturingYear(request.getManufacturingYear());
        vehicle.setManufacturingMonth(request.getManufacturingMonth());
        vehicle.setPurchasePrice(request.getPurchasePrice());
        vehicle.setSellingPrice(request.getSellingPrice());
        vehicle.setArrivalDate(request.getArrivalDate());
        vehicle.setStatus(VehicleStatus.IN_TRANSIT);

        if (request.getStockyardId() != null) {
            Stockyard stockyard = stockyardRepository.findById(request.getStockyardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stockyard not found"));
            vehicle.setStockyard(stockyard);
        }

        vehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle added successfully: id={}, VIN={}", vehicle.getVehicleId(), vehicle.getVin());
        return mapToResponse(vehicle);
    }

    @Override
    @Cacheable(value = "vehicles", key = "#id")
    public VehicleResponse getVehicleById(Long id) {
        log.debug("Fetching vehicle by id: {}", id);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return mapToResponse(vehicle);
    }

    @Override
    public List<VehicleResponse> getVehiclesByDealership(Long dealershipId) {
        List<Vehicle> vehicles = vehicleRepository.findByDealershipDealershipId(dealershipId);
        return vehicles.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<VehicleResponse> getVehiclesByStatus(Long dealershipId, VehicleStatus status) {
        List<Vehicle> vehicles = vehicleRepository.findByDealershipDealershipIdAndStatus(dealershipId, status);
        return vehicles.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public VehicleResponse updateVehicleStatus(Long id, VehicleStatus status) {
        log.info("Updating vehicle status: id={}, newStatus={}", id, status);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setStatus(status);
        vehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle status updated successfully: id={}, status={}", id, status);
        return mapToResponse(vehicle);
    }

    @Override
    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        log.info("Updating vehicle: id={}", id);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (!vehicle.getVin().equals(request.getVin()) && vehicleRepository.findByVin(request.getVin()).isPresent()) {
            throw new BadRequestException("Vehicle with VIN " + request.getVin() + " already exists");
        }

        VehicleVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        vehicle.setVariant(variant);
        vehicle.setVin(request.getVin());
        vehicle.setChassisNumber(request.getChassisNumber());
        vehicle.setEngineNumber(request.getEngineNumber());
        vehicle.setColor(request.getColor());
        vehicle.setManufacturingYear(request.getManufacturingYear());
        vehicle.setManufacturingMonth(request.getManufacturingMonth());
        vehicle.setPurchasePrice(request.getPurchasePrice());
        vehicle.setSellingPrice(request.getSellingPrice());
        vehicle.setArrivalDate(request.getArrivalDate());

        if (request.getStockyardId() != null) {
            Stockyard stockyard = stockyardRepository.findById(request.getStockyardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stockyard not found"));
            vehicle.setStockyard(stockyard);
        }

        vehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle updated successfully: id={}", id);
        return mapToResponse(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        VehicleResponse response = new VehicleResponse();
        response.setId(vehicle.getVehicleId());
        response.setVin(vehicle.getVin());
        response.setChassisNumber(vehicle.getChassisNumber());
        response.setEngineNumber(vehicle.getEngineNumber());
        response.setColor(vehicle.getColor());
        response.setManufacturingYear(vehicle.getManufacturingYear());
        response.setManufacturingMonth(vehicle.getManufacturingMonth());
        response.setStatus(vehicle.getStatus().name());
        response.setPrice(vehicle.getSellingPrice());
        response.setArrivalDate(vehicle.getArrivalDate());
        response.setVariantId(vehicle.getVariant().getVariantId());
        response.setVariant(vehicle.getVariant().getVariantName());
        if (vehicle.getVariant().getFuelType() != null) {
            response.setFuelType(vehicle.getVariant().getFuelType().name());
        }
        if (vehicle.getVariant().getTransmission() != null) {
            response.setTransmissionType(vehicle.getVariant().getTransmission().name());
        }
        response.setModel(vehicle.getVariant().getModel().getModelName());
        response.setDealershipName(vehicle.getDealership().getDealershipName());
        
        if (vehicle.getStockyard() != null) {
            response.setStockyardId(vehicle.getStockyard().getStockyardId());
            response.setStockyardLocation(vehicle.getStockyard().getStockyardName());
        }
        
        return response;
    }

    @Override
    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public void deleteVehicle(Long id) {
        log.info("Deleting vehicle: id={}", id);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        
        // Check if vehicle has dependencies
        if (hasBookings(vehicle)) {
            throw new BadRequestException("Cannot delete vehicle. It has associated bookings.");
        }
        
        if (hasTestDrives(vehicle)) {
            throw new BadRequestException("Cannot delete vehicle. It has associated test drives.");
        }
        
        if (hasSalesTransactions(vehicle)) {
            throw new BadRequestException("Cannot delete vehicle. It has associated sales transactions.");
        }
        
        if (hasDispatchRecords(vehicle)) {
            throw new BadRequestException("Cannot delete vehicle. It has associated dispatch records.");
        }
        
        vehicleRepository.delete(vehicle);
        log.info("Vehicle deleted successfully: id={}", id);
    }
    
    private boolean hasBookings(Vehicle vehicle) {
        // Check if vehicle has any bookings
        return vehicleRepository.countBookingsByVehicleId(vehicle.getVehicleId()) > 0;
    }
    
    private boolean hasTestDrives(Vehicle vehicle) {
        // Check if vehicle has any test drives
        return vehicleRepository.countTestDrivesByVehicleId(vehicle.getVehicleId()) > 0;
    }
    
    private boolean hasSalesTransactions(Vehicle vehicle) {
        // Check if vehicle has any sales transactions
        return vehicleRepository.countSalesTransactionsByVehicleId(vehicle.getVehicleId()) > 0;
    }
    
    private boolean hasDispatchRecords(Vehicle vehicle) {
        // Check if vehicle has any dispatch records
        return vehicleRepository.countDispatchRecordsByVehicleId(vehicle.getVehicleId()) > 0;
    }

    @Override
    public Page<VehicleResponse> findVehiclesWithFilters(VehicleFilterDTO filter, Pageable pageable) {
        log.debug("Finding vehicles with filters: {}", filter);
        Specification<Vehicle> spec = VehicleSpecification.withFilters(filter);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(spec, pageable);
        return vehiclePage.map(this::mapToResponse);
    }

    @Override
    public List<VehicleResponse> findVehiclesWithFilters(VehicleFilterDTO filter) {
        log.debug("Finding vehicles with filters (no pagination): {}", filter);
        Specification<Vehicle> spec = VehicleSpecification.withFilters(filter);
        List<Vehicle> vehicles = vehicleRepository.findAll(spec);
        return vehicles.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
}
