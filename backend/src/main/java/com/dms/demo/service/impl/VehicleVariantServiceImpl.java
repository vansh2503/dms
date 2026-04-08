package com.dms.demo.service.impl;

import com.dms.demo.dto.request.VehicleVariantRequest;
import com.dms.demo.dto.response.VehicleVariantResponse;
import com.dms.demo.entity.VehicleModel;
import com.dms.demo.entity.VehicleVariant;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.VehicleModelRepository;
import com.dms.demo.repository.VehicleVariantRepository;
import com.dms.demo.service.VehicleVariantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleVariantServiceImpl implements VehicleVariantService {

    private final VehicleVariantRepository variantRepository;
    private final VehicleModelRepository modelRepository;

    @Override
    @Transactional
    @CacheEvict(value = "vehicleVariants", allEntries = true)
    public VehicleVariantResponse createVariant(VehicleVariantRequest request) {
        log.info("Creating vehicle variant: {}", request.getVariantCode());
        VehicleModel model = modelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle model not found"));

        VehicleVariant variant = new VehicleVariant();
        variant.setModel(model);
        variant.setVariantName(request.getVariantName());
        variant.setVariantCode(request.getVariantCode());
        variant.setFuelType(request.getFuelType());
        variant.setTransmission(request.getTransmission());
        variant.setEngineCapacity(request.getEngineCapacity());
        variant.setMaxPower(request.getMaxPower());
        variant.setMaxTorque(request.getMaxTorque());
        variant.setSeatingCapacity(request.getSeatingCapacity());
        variant.setGroundClearance(request.getGroundClearance());
        variant.setBootSpace(request.getBootSpace());
        variant.setAirbags(request.getAirbags());
        variant.setAraiMileage(request.getAraiMileage());
        variant.setFeatures(request.getFeatures());
        variant.setBasePrice(request.getBasePrice());
        variant.setExShowroomPrice(request.getExShowroomPrice());
        variant.setIsActive(true);

        variant = variantRepository.save(variant);
        log.info("Vehicle variant created successfully: id={}, code={}", variant.getVariantId(), variant.getVariantCode());
        return mapToResponse(variant);
    }

    @Override
    @Transactional
    @CacheEvict(value = "vehicleVariants", allEntries = true)
    public VehicleVariantResponse updateVariant(Long id, VehicleVariantRequest request) {
        log.info("Updating vehicle variant: id={}", id);
        VehicleVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle variant not found"));

        VehicleModel model = modelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle model not found"));

        variant.setModel(model);
        variant.setVariantName(request.getVariantName());
        variant.setVariantCode(request.getVariantCode());
        variant.setFuelType(request.getFuelType());
        variant.setTransmission(request.getTransmission());
        variant.setEngineCapacity(request.getEngineCapacity());
        variant.setMaxPower(request.getMaxPower());
        variant.setMaxTorque(request.getMaxTorque());
        variant.setSeatingCapacity(request.getSeatingCapacity());
        variant.setGroundClearance(request.getGroundClearance());
        variant.setBootSpace(request.getBootSpace());
        variant.setAirbags(request.getAirbags());
        variant.setAraiMileage(request.getAraiMileage());
        variant.setFeatures(request.getFeatures());
        variant.setBasePrice(request.getBasePrice());
        variant.setExShowroomPrice(request.getExShowroomPrice());

        variant = variantRepository.save(variant);
        log.info("Vehicle variant updated successfully: id={}", id);
        return mapToResponse(variant);
    }

    @Override
    @Cacheable(value = "vehicleVariants", key = "#id")
    public VehicleVariantResponse getVariantById(Long id) {
        log.debug("Fetching vehicle variant by id: {}", id);
        VehicleVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle variant not found"));
        return mapToResponse(variant);
    }

    @Override
    @Cacheable(value = "vehicleVariants", key = "'all'")
    public List<VehicleVariantResponse> getAllVariants() {
        log.debug("Fetching all vehicle variants");
        return variantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "vehicleVariants", key = "'model-' + #modelId")
    public List<VehicleVariantResponse> getVariantsByModel(Long modelId) {
        log.debug("Fetching vehicle variants by model: {}", modelId);
        return variantRepository.findByModelModelId(modelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "vehicleVariants", key = "'active'")
    public List<VehicleVariantResponse> getActiveVariants() {
        log.debug("Fetching active vehicle variants");
        return variantRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleVariantResponse> getVariantsWithFilters(String search, Long modelId, 
                                                                com.dms.demo.enums.FuelType fuelType, 
                                                                com.dms.demo.enums.TransmissionType transmission) {
        log.debug("Fetching variants with filters - search: {}, modelId: {}, fuelType: {}, transmission: {}", 
                  search, modelId, fuelType, transmission);
        return variantRepository.findWithFilters(search, modelId, fuelType, transmission).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "vehicleVariants", allEntries = true)
    public void deleteVariant(Long id) {
        log.info("Deleting vehicle variant: id={}", id);
        VehicleVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle variant not found"));
        variant.setIsActive(false);
        variantRepository.save(variant);
        log.info("Vehicle variant deleted successfully: id={}", id);
    }

    private VehicleVariantResponse mapToResponse(VehicleVariant variant) {
        VehicleVariantResponse response = new VehicleVariantResponse();
        response.setId(variant.getVariantId());
        response.setModel(variant.getModel().getModelName());
        response.setVariantName(variant.getVariantName());
        response.setVariantCode(variant.getVariantCode());
        response.setFuelType(variant.getFuelType());
        response.setTransmission(variant.getTransmission());
        response.setEngineCC(variant.getEngineCapacity());
        response.setMaxPower(variant.getMaxPower());
        response.setMaxTorque(variant.getMaxTorque());
        response.setSeatingCapacity(variant.getSeatingCapacity());
        response.setGroundClearance(variant.getGroundClearance());
        response.setBootSpace(variant.getBootSpace());
        response.setAirbags(variant.getAirbags());
        response.setAraiMileage(variant.getAraiMileage());
        response.setFeatures(variant.getFeatures());
        response.setPrice(variant.getBasePrice());
        response.setExShowroomPrice(variant.getExShowroomPrice());
        response.setIsActive(variant.getIsActive());
        return response;
    }
}
