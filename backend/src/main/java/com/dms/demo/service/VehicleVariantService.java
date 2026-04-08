package com.dms.demo.service;

import com.dms.demo.dto.request.VehicleVariantRequest;
import com.dms.demo.dto.response.VehicleVariantResponse;
import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;
import java.util.List;

public interface VehicleVariantService {
    VehicleVariantResponse createVariant(VehicleVariantRequest request);
    VehicleVariantResponse updateVariant(Long id, VehicleVariantRequest request);
    VehicleVariantResponse getVariantById(Long id);
    List<VehicleVariantResponse> getAllVariants();
    List<VehicleVariantResponse> getVariantsByModel(Long modelId);
    List<VehicleVariantResponse> getActiveVariants();
    List<VehicleVariantResponse> getVariantsWithFilters(String search, Long modelId, FuelType fuelType, TransmissionType transmission);
    void deleteVariant(Long id);
}
