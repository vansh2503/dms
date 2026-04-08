package com.dms.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.Vehicle;
import com.dms.demo.enums.VehicleStatus;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    Optional<Vehicle> findByVin(String vin);
    Optional<Vehicle> findByChassisNumber(String chassisNumber);
    
    @Query("SELECT v FROM Vehicle v JOIN FETCH v.variant vv JOIN FETCH vv.model JOIN FETCH v.dealership WHERE v.dealership.dealershipId = :dealershipId AND v.status = :status")
    List<Vehicle> findByDealershipDealershipIdAndStatus(@Param("dealershipId") Long dealershipId, @Param("status") VehicleStatus status);
    
    @Query("SELECT v FROM Vehicle v JOIN FETCH v.variant vv JOIN FETCH vv.model JOIN FETCH v.dealership WHERE v.dealership.dealershipId = :dealershipId")
    List<Vehicle> findByDealershipDealershipId(@Param("dealershipId") Long dealershipId);

    Page<Vehicle> findAll(Pageable pageable);
    Page<Vehicle> findByDealershipDealershipId(Long dealershipId, Pageable pageable);
    Page<Vehicle> findByStatus(VehicleStatus status, Pageable pageable);
    Page<Vehicle> findByDealershipDealershipIdAndStatus(Long dealershipId, VehicleStatus status, Pageable pageable);

    Long countByStatus(VehicleStatus status);
    Long countByStatusAndDealershipDealershipId(VehicleStatus status, Long dealershipId);
    Long countByStatusIn(List<VehicleStatus> statuses);
    Long countByDealershipDealershipIdAndStatusIn(Long dealershipId, List<VehicleStatus> statuses);
    
    // Count dependencies for safe delete
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.vehicle.vehicleId = :vehicleId")
    long countBookingsByVehicleId(@Param("vehicleId") Long vehicleId);
    
    @Query("SELECT COUNT(t) FROM TestDrive t WHERE t.vehicle.vehicleId = :vehicleId")
    long countTestDrivesByVehicleId(@Param("vehicleId") Long vehicleId);
    
    @Query("SELECT COUNT(s) FROM SalesTransaction s WHERE s.vehicle.vehicleId = :vehicleId")
    long countSalesTransactionsByVehicleId(@Param("vehicleId") Long vehicleId);
    
    @Query("SELECT COUNT(d) FROM DispatchRecord d WHERE d.vehicle.vehicleId = :vehicleId")
    long countDispatchRecordsByVehicleId(@Param("vehicleId") Long vehicleId);
}
