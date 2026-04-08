package com.dms.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dms.demo.entity.AccessoryOrder;

public interface AccessoryOrderRepository extends JpaRepository<AccessoryOrder, Long> {
    List<AccessoryOrder> findByBookingBookingId(Long bookingId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT ao FROM AccessoryOrder ao WHERE ao.booking.customer.customerId = :customerId")
    List<AccessoryOrder> findByCustomerId(
        @org.springframework.data.repository.query.Param("customerId") Long customerId);
}
