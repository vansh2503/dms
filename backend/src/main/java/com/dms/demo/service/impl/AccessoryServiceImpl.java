package com.dms.demo.service.impl;

import com.dms.demo.dto.request.AccessoryRequest;
import com.dms.demo.dto.response.AccessoryResponse;
import com.dms.demo.entity.Accessory;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.AccessoryRepository;
import com.dms.demo.service.AccessoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccessoryServiceImpl implements AccessoryService {

    private final AccessoryRepository accessoryRepository;

    @Override
    @Transactional
    @CacheEvict(value = "accessories", allEntries = true)
    public AccessoryResponse createAccessory(AccessoryRequest request) {
        log.info("Creating accessory: {}", request.getAccessoryCode());
        
        accessoryRepository.findByAccessoryCode(request.getAccessoryCode())
                .ifPresent(a -> {
                    throw new BadRequestException("Accessory with code " + request.getAccessoryCode() + " already exists");
                });

        Accessory accessory = new Accessory();
        accessory.setAccessoryName(request.getAccessoryName());
        accessory.setAccessoryCode(request.getAccessoryCode());
        accessory.setCategory(request.getCategory());
        accessory.setDescription(request.getDescription());
        accessory.setPrice(request.getPrice());
        accessory.setIsActive(true);

        accessory = accessoryRepository.save(accessory);
        log.info("Accessory created successfully: id={}, code={}", accessory.getAccessoryId(), accessory.getAccessoryCode());
        return mapToResponse(accessory);
    }

    @Override
    @Cacheable(value = "accessories", key = "#id")
    public AccessoryResponse getAccessoryById(Long id) {
        log.debug("Fetching accessory by id: {}", id);
        Accessory accessory = accessoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory not found"));
        return mapToResponse(accessory);
    }

    @Override
    @Cacheable(value = "accessories", key = "'all'")
    public List<AccessoryResponse> getAllAccessories() {
        log.debug("Fetching all active accessories");
        return accessoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccessoryResponse> getAccessoriesByCategory(String category) {
        return accessoryRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccessoryResponse> getAccessoriesWithFilters(String search, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        log.debug("Fetching accessories with filters - search: {}, category: {}, minPrice: {}, maxPrice: {}", 
                  search, category, minPrice, maxPrice);
        return accessoryRepository.findWithFilters(search, category, minPrice, maxPrice).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "accessories", allEntries = true)
    public AccessoryResponse updateAccessory(Long id, AccessoryRequest request) {
        log.info("Updating accessory: id={}", id);
        Accessory accessory = accessoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory not found"));

        accessory.setAccessoryName(request.getAccessoryName());
        accessory.setCategory(request.getCategory());
        accessory.setDescription(request.getDescription());
        accessory.setPrice(request.getPrice());

        accessory = accessoryRepository.save(accessory);
        log.info("Accessory updated successfully: id={}", id);
        return mapToResponse(accessory);
    }

    @Override
    @Transactional
    @CacheEvict(value = "accessories", allEntries = true)
    public void deleteAccessory(Long id) {
        log.info("Deleting accessory: id={}", id);
        Accessory accessory = accessoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory not found"));
        accessory.setIsActive(false);
        accessoryRepository.save(accessory);
        log.info("Accessory deleted successfully: id={}", id);
    }

    private AccessoryResponse mapToResponse(Accessory accessory) {
        AccessoryResponse response = new AccessoryResponse();
        response.setId(accessory.getAccessoryId());
        response.setName(accessory.getAccessoryName());
        response.setCode(accessory.getAccessoryCode());
        response.setCategory(accessory.getCategory());
        response.setDescription(accessory.getDescription());
        response.setPrice(accessory.getPrice());
        response.setStockQuantity(0);
        response.setIsActive(accessory.getIsActive());
        return response;
    }
}
