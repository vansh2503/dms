package com.dms.demo.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.DispatchRecord;

public interface DispatchRecordRepository extends JpaRepository<DispatchRecord, Long> {
    Optional<DispatchRecord> findByBookingBookingId(Long bookingId);
    Optional<DispatchRecord> findByVehicleVehicleId(Long vehicleId);
    Long countByDispatchDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT COUNT(d) FROM DispatchRecord d WHERE d.dispatchDate BETWEEN :from AND :to " +
           "AND d.booking.dealership.dealershipId = :dealershipId")
    Long countByDispatchDateBetweenAndDealershipId(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("dealershipId") Long dealershipId);
    
    @Query("SELECT COUNT(d) FROM DispatchRecord d WHERE d.dispatchDate BETWEEN :from AND :to " +
           "AND d.booking.dealership.dealershipId = :dealershipId")
    Long countByDealershipIdAndDispatchDateBetween(
            @Param("dealershipId") Long dealershipId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}
