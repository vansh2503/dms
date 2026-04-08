package com.dms.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.TestDrive;
import com.dms.demo.enums.TestDriveStatus;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {
    List<TestDrive> findByCustomerCustomerId(Long customerId);
    List<TestDrive> findByDealershipDealershipIdAndScheduledDate(Long dealershipId, LocalDate date);
    List<TestDrive> findBySalesExecutiveUserIdAndStatus(Long userId, TestDriveStatus status);
    List<TestDrive> findByStatus(TestDriveStatus status);
    List<TestDrive> findByCustomerCustomerIdAndVehicleVehicleIdAndStatus(Long customerId, Long vehicleId, TestDriveStatus status);
    
    @Query("SELECT td.testDriveId, td.scheduledTime, c.firstName, c.lastName, vm.modelName, vv.variantName, td.status " +
           "FROM TestDrive td JOIN td.customer c JOIN td.vehicle v JOIN v.variant vv JOIN vv.model vm " +
           "WHERE td.dealership.dealershipId = :dealershipId AND td.scheduledDate = :date " +
           "ORDER BY td.scheduledTime ASC")
    List<Object[]> findTodayTestDrivesByDealership(@Param("dealershipId") Long dealershipId, @Param("date") LocalDate date);
    
    @Query("SELECT td.testDriveId, td.scheduledTime, c.firstName, c.lastName, vm.modelName, vv.variantName, td.status " +
           "FROM TestDrive td JOIN td.customer c JOIN td.vehicle v JOIN v.variant vv JOIN vv.model vm " +
           "WHERE td.scheduledDate = :date " +
           "ORDER BY td.scheduledTime ASC")
    List<Object[]> findTodayTestDrives(@Param("date") LocalDate date);
}
