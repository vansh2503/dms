package com.dms.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.dms.demo.enums.ExchangeStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "exchange_requests")
@EntityListeners(AuditingEntityListener.class)
public class ExchangeRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exchange_id")
    private Long exchangeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Column(name = "old_vehicle_make", nullable = false, length = 50)
    private String oldVehicleMake;
    
    @Column(name = "old_vehicle_model", nullable = false, length = 50)
    private String oldVehicleModel;
    
    @Column(name = "old_vehicle_variant", length = 50)
    private String oldVehicleVariant;
    
    @Column(name = "old_vehicle_year", nullable = false)
    private Integer oldVehicleYear;
    
    @Column(name = "old_vehicle_registration", nullable = false, length = 20)
    private String oldVehicleRegistration;
    
    @Column(name = "old_vehicle_km_driven")
    private Integer oldVehicleKmDriven;
    
    @Column(name = "old_vehicle_condition", length = 50)
    private String oldVehicleCondition;
    
    @Column(name = "valuation_amount", precision = 12, scale = 2)
    private BigDecimal valuationAmount;
    
    @Column(name = "offered_amount", precision = 12, scale = 2)
    private BigDecimal offeredAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExchangeStatus status = ExchangeStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by")
    private User evaluatedBy;
    
    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
}
