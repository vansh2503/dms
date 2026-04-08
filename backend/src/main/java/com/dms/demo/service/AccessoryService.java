package com.dms.demo.service;

import com.dms.demo.dto.request.AccessoryRequest;
import com.dms.demo.dto.response.AccessoryResponse;
import java.math.BigDecimal;
import java.util.List;

public interface AccessoryService {
    AccessoryResponse createAccessory(AccessoryRequest request);
    AccessoryResponse getAccessoryById(Long id);
    List<AccessoryResponse> getAllAccessories();
    List<AccessoryResponse> getAccessoriesByCategory(String category);
    List<AccessoryResponse> getAccessoriesWithFilters(String search, String category, BigDecimal minPrice, BigDecimal maxPrice);
    AccessoryResponse updateAccessory(Long id, AccessoryRequest request);
    void deleteAccessory(Long id);
}
