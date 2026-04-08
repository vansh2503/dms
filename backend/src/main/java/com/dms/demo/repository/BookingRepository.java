package com.dms.demo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.Booking;
import com.dms.demo.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {
    Optional<Booking> findByBookingNumber(String bookingNumber);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.variant v JOIN FETCH v.model WHERE b.customer.customerId = :customerId")
    List<Booking> findByCustomerCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.variant v JOIN FETCH v.model JOIN FETCH b.dealership WHERE b.dealership.dealershipId = :dealershipId AND b.status = :status")
    List<Booking> findByDealershipDealershipIdAndStatus(@Param("dealershipId") Long dealershipId, @Param("status") BookingStatus status);
    
    List<Booking> findBySalesExecutiveUserId(Long userId);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.variant v JOIN FETCH v.model JOIN FETCH b.dealership WHERE b.dealership.dealershipId = :dealershipId")
    List<Booking> findByDealershipDealershipId(@Param("dealershipId") Long dealershipId);
    
    List<Booking> findByVehicleVehicleIdAndStatusIn(Long vehicleId, List<BookingStatus> statuses);
    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status AND b.dealership.dealershipId = :dealershipId")
    Long countByStatusAndDealershipDealershipId(@Param("status") BookingStatus status, @Param("dealershipId") Long dealershipId);
    
    @Query("SELECT b FROM Booking b WHERE b.dealership.dealershipId = :dealershipId " +
           "AND b.bookingDate BETWEEN :fromDate AND :toDate")
    List<Booking> findByDealershipAndDateRange(
            @Param("dealershipId") Long dealershipId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :fromDate AND :toDate")
    List<Booking> findByDateRange(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.dealership.dealershipId = :dealershipId AND b.bookingDate = :bookingDate")
    Long countByDealershipDealershipIdAndBookingDate(@Param("dealershipId") Long dealershipId, @Param("bookingDate") LocalDate bookingDate);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingDate = :bookingDate")
    Long countByBookingDate(@Param("bookingDate") LocalDate bookingDate);
    
    @Query("SELECT b.bookingId, b.bookingNumber, c.firstName, c.lastName, vm.modelName, vv.variantName, b.status " +
           "FROM Booking b JOIN b.customer c JOIN b.variant vv JOIN vv.model vm " +
           "WHERE b.dealership.dealershipId = :dealershipId " +
           "ORDER BY b.bookingDate DESC")
    List<Object[]> findRecentBookingsByDealership(@Param("dealershipId") Long dealershipId, Pageable pageable);
    
    @Query("SELECT b.bookingId, b.bookingNumber, c.firstName, c.lastName, vm.modelName, vv.variantName, b.status " +
           "FROM Booking b JOIN b.customer c JOIN b.variant vv JOIN vv.model vm " +
           "ORDER BY b.bookingDate DESC")
    List<Object[]> findRecentBookings(Pageable pageable);
    
    @Query("SELECT v.vehicleId, v.vin, vm.modelName, vv.variantName, b.expectedDeliveryDate " +
           "FROM Booking b JOIN b.vehicle v JOIN b.variant vv JOIN vv.model vm " +
           "WHERE b.dealership.dealershipId = :dealershipId " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.expectedDeliveryDate BETWEEN :startDate AND :endDate " +
           "ORDER BY b.expectedDeliveryDate ASC")
    List<Object[]> findVehiclesDueForDispatchByDealership(
            @Param("dealershipId") Long dealershipId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    
    @Query("SELECT v.vehicleId, v.vin, vm.modelName, vv.variantName, b.expectedDeliveryDate " +
           "FROM Booking b JOIN b.vehicle v JOIN b.variant vv JOIN vv.model vm " +
           "WHERE b.status = 'CONFIRMED' " +
           "AND b.expectedDeliveryDate BETWEEN :startDate AND :endDate " +
           "ORDER BY b.expectedDeliveryDate ASC")
    List<Object[]> findVehiclesDueForDispatch(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
