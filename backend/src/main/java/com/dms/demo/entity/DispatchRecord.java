package com.dms.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "dispatch_records")
@EntityListeners(AuditingEntityListener.class)
public class DispatchRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispatch_id")
    private Long dispatchId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Column(name = "dispatch_date", nullable = false)
    private LocalDate dispatchDate;
    
    @Column(name = "dispatch_time")
    private LocalTime dispatchTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispatched_by", nullable = false)
    private User dispatchedBy;
    
    @Column(name = "delivery_location", columnDefinition = "TEXT")
    private String deliveryLocation;
    
    @Column(name = "odometer_reading")
    private Integer odometerReading;
    
    @Column(name = "fuel_level", length = 20)
    private String fuelLevel;
    
    @Column(name = "documents_handed_over")
    private Boolean documentsHandedOver = false;
    
    @Column(name = "keys_handed_over")
    private Boolean keysHandedOver = false;
    
    @Column(name = "customer_signature")
    private Boolean customerSignature = false;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
}
