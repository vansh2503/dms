package com.dms.demo.service;

import com.dms.demo.dto.request.TestDriveRequest;
import com.dms.demo.dto.response.TestDriveResponse;
import com.dms.demo.enums.TestDriveStatus;
import java.time.LocalDate;
import java.util.List;

public interface TestDriveService {
    TestDriveResponse scheduleTestDrive(TestDriveRequest request);
    TestDriveResponse getTestDriveById(Long id);
    List<TestDriveResponse> getTestDrivesByCustomer(Long customerId);
    TestDriveResponse updateStatus(Long id, TestDriveStatus status, String feedback);
    List<TestDriveResponse> getTestDrivesByDealershipAndDate(Long dealershipId, LocalDate date);
    List<TestDriveResponse> getTestDrivesByStatus(TestDriveStatus status);
    List<TestDriveResponse> getAllTestDrives();
}
