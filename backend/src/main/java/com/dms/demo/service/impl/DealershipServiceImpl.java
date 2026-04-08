package com.dms.demo.service.impl;

import com.dms.demo.dto.request.DealershipRequest;
import com.dms.demo.dto.response.DealershipResponse;
import com.dms.demo.entity.Dealership;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.DealershipRepository;
import com.dms.demo.service.DealershipService;
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
public class DealershipServiceImpl implements DealershipService {

    private final DealershipRepository dealershipRepository;

    @Override
    @Transactional
    @CacheEvict(value = "dealerships", allEntries = true)
    public DealershipResponse createDealership(DealershipRequest request) {
        log.info("Creating dealership: {}", request.getDealershipCode());
        if (dealershipRepository.existsByDealershipCode(request.getDealershipCode())) {
            throw new BadRequestException("Dealership with code " + request.getDealershipCode() + " already exists");
        }
        Dealership dealership = new Dealership();
        mapToEntity(request, dealership);
        dealership = dealershipRepository.save(dealership);
        log.info("Dealership created successfully: id={}, code={}", dealership.getDealershipId(), dealership.getDealershipCode());
        return mapToResponse(dealership);
    }

    @Override
    @Cacheable(value = "dealerships", key = "#id")
    public DealershipResponse getDealershipById(Long id) {
        log.debug("Fetching dealership by id: {}", id);
        return mapToResponse(findById(id));
    }

    @Override
    @Cacheable(value = "dealerships", key = "'all'")
    public List<DealershipResponse> getAllDealerships() {
        log.debug("Fetching all dealerships");
        return dealershipRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "dealerships", allEntries = true)
    public DealershipResponse updateDealership(Long id, DealershipRequest request) {
        log.info("Updating dealership: id={}", id);
        Dealership dealership = findById(id);
        if (!dealership.getDealershipCode().equals(request.getDealershipCode()) &&
                dealershipRepository.existsByDealershipCode(request.getDealershipCode())) {
            throw new BadRequestException("Dealership with code " + request.getDealershipCode() + " already exists");
        }
        mapToEntity(request, dealership);
        dealership = dealershipRepository.save(dealership);
        log.info("Dealership updated successfully: id={}", id);
        return mapToResponse(dealership);
    }

    @Override
    @Transactional
    @CacheEvict(value = "dealerships", allEntries = true)
    public void deleteDealership(Long id) {
        log.info("Deleting dealership: id={}", id);
        dealershipRepository.delete(findById(id));
        log.info("Dealership deleted successfully: id={}", id);
    }

    private Dealership findById(Long id) {
        return dealershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found with id: " + id));
    }

    private void mapToEntity(DealershipRequest request, Dealership dealership) {
        dealership.setDealershipCode(request.getDealershipCode());
        dealership.setDealershipName(request.getDealershipName());
        dealership.setAddress(request.getAddress());
        dealership.setCity(request.getCity());
        dealership.setState(request.getState());
        dealership.setPincode(request.getPincode());
        dealership.setPhone(request.getPhone());
        dealership.setEmail(request.getEmail());
        dealership.setManagerName(request.getManagerName());
    }

    private DealershipResponse mapToResponse(Dealership d) {
        DealershipResponse response = new DealershipResponse();
        response.setDealershipId(d.getDealershipId());
        response.setDealershipCode(d.getDealershipCode());
        response.setDealershipName(d.getDealershipName());
        response.setAddress(d.getAddress());
        response.setCity(d.getCity());
        response.setState(d.getState());
        response.setPincode(d.getPincode());
        response.setPhone(d.getPhone());
        response.setEmail(d.getEmail());
        response.setManagerName(d.getManagerName());
        response.setIsActive(d.getIsActive());
        return response;
    }
}
