package com.dms.demo.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dms.demo.dto.request.TestDriveRequest;
import com.dms.demo.dto.response.TestDriveResponse;
import com.dms.demo.entity.Customer;
import com.dms.demo.entity.Dealership;
import com.dms.demo.entity.TestDrive;
import com.dms.demo.entity.User;
import com.dms.demo.entity.Vehicle;
import com.dms.demo.enums.TestDriveStatus;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.CustomerRepository;
import com.dms.demo.repository.DealershipRepository;
import com.dms.demo.repository.TestDriveRepository;
import com.dms.demo.repository.UserRepository;
import com.dms.demo.repository.VehicleRepository;
import com.dms.demo.service.TestDriveService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestDriveServiceImpl implements TestDriveService {

    private final TestDriveRepository testDriveRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final DealershipRepository dealershipRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TestDriveResponse scheduleTestDrive(TestDriveRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));

        User salesExecutive = userRepository.findById(request.getSalesExecutiveId())
                .orElseThrow(() -> new ResourceNotFoundException("Sales executive not found"));

        // Check if customer already has a scheduled test drive for same vehicle
        List<TestDrive> existingTestDrives = testDriveRepository
                .findByCustomerCustomerIdAndVehicleVehicleIdAndStatus(
                        customer.getCustomerId(),
                        vehicle.getVehicleId(),
                        TestDriveStatus.SCHEDULED
                );

        if (!existingTestDrives.isEmpty()) {
            throw new BadRequestException("Customer already has a scheduled test drive for this vehicle");
        }

        TestDrive testDrive = new TestDrive();
        testDrive.setCustomer(customer);
        testDrive.setVehicle(vehicle);
        testDrive.setDealership(dealership);
        testDrive.setSalesExecutive(salesExecutive);
        testDrive.setScheduledDate(request.getScheduledDate());
        testDrive.setScheduledTime(request.getScheduledTime());
        testDrive.setStatus(TestDriveStatus.SCHEDULED);

        testDrive = testDriveRepository.save(testDrive);
        return mapToResponse(testDrive);
    }

    @Override
    public TestDriveResponse getTestDriveById(Long id) {
        TestDrive testDrive = testDriveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test drive not found"));
        return mapToResponse(testDrive);
    }

    @Override
    public List<TestDriveResponse> getTestDrivesByCustomer(Long customerId) {
        List<TestDrive> testDrives = testDriveRepository.findByCustomerCustomerId(customerId);
        return testDrives.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TestDriveResponse updateStatus(Long id, TestDriveStatus status, String feedback) {
        TestDrive testDrive = testDriveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test drive not found"));

        if (testDrive.getStatus() == TestDriveStatus.CANCELLED) {
            throw new BadRequestException("Cannot update cancelled test drive");
        }

        testDrive.setStatus(status);
        if (feedback != null && !feedback.isEmpty()) {
            testDrive.setFeedback(feedback);
        }

        testDrive = testDriveRepository.save(testDrive);
        return mapToResponse(testDrive);
    }

    @Override
    public List<TestDriveResponse> getTestDrivesByDealershipAndDate(Long dealershipId, LocalDate date) {
        List<TestDrive> testDrives = testDriveRepository
                .findByDealershipDealershipIdAndScheduledDate(dealershipId, date);
        return testDrives.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<TestDriveResponse> getTestDrivesByStatus(TestDriveStatus status) {
        List<TestDrive> testDrives = testDriveRepository.findByStatus(status);
        return testDrives.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<TestDriveResponse> getAllTestDrives() {
        return testDriveRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TestDriveResponse mapToResponse(TestDrive testDrive) {
        TestDriveResponse response = new TestDriveResponse();
        response.setTestDriveId(testDrive.getTestDriveId());
        response.setCustomerName(testDrive.getCustomer().getFirstName() + " " + 
                testDrive.getCustomer().getLastName());
        response.setVehicleVin(testDrive.getVehicle().getVin());
        response.setVehicleModel(testDrive.getVehicle().getVariant().getModel().getModelName());
        response.setVariantName(testDrive.getVehicle().getVariant().getVariantName());
        response.setDealershipName(testDrive.getDealership().getDealershipName());
        response.setSalesExecutiveName(testDrive.getSalesExecutive() != null ? 
                testDrive.getSalesExecutive().getFullName() : "N/A");
        response.setScheduledDate(testDrive.getScheduledDate());
        response.setScheduledTime(testDrive.getScheduledTime());
        response.setScheduledDateTime(testDrive.getScheduledDate().toString() + "T" + 
                testDrive.getScheduledTime().toString());
        response.setStatus(testDrive.getStatus().name());
        response.setFeedback(testDrive.getFeedback());
        return response;
    }
}
