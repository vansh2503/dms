package com.dms.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.ExchangeRequest;
import com.dms.demo.enums.ExchangeStatus;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findByCustomerCustomerId(Long customerId);
    List<ExchangeRequest> findByStatus(ExchangeStatus status);
    List<ExchangeRequest> findByBookingBookingId(Long bookingId);
    
    @Query("SELECT e FROM ExchangeRequest e " +
           "JOIN e.customer c " +
           "JOIN e.booking b " +
           "JOIN b.vehicle v " +
           "WHERE (:search IS NULL OR " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.oldVehicleMake) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.oldVehicleModel) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.oldVehicleRegistration) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR e.status = :status) " +
           "AND (:vehicleId IS NULL OR v.vehicleId = :vehicleId) " +
           "AND (:fromDate IS NULL OR CAST(e.createdAt AS date) >= :fromDate) " +
           "AND (:toDate IS NULL OR CAST(e.createdAt AS date) <= :toDate)")
    List<ExchangeRequest> findWithFilters(
        @Param("search") String search,
        @Param("status") ExchangeStatus status,
        @Param("vehicleId") Long vehicleId,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );
}
