package com.dms.demo.entity;

import com.dms.demo.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicle_vin", columnList = "vin"),
    @Index(name = "idx_vehicle_chassis", columnList = "chassis_number"),
    @Index(name = "idx_vehicle_variant", columnList = "variant_id"),
    @Index(name = "idx_vehicle_dealership", columnList = "dealership_id"),
    @Index(name = "idx_vehicle_status", columnList = "status"),
    @Index(name = "idx_vehicle_stockyard", columnList = "stockyard_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicleId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private VehicleVariant variant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;
    
    @Column(unique = true, nullable = false, length = 17)
    private String vin;
    
    @Column(name = "chassis_number", unique = true, nullable = false, length = 30)
    private String chassisNumber;
    
    @Column(name = "engine_number", unique = true, nullable = false, length = 30)
    private String engineNumber;
    
    @Column(nullable = false, length = 30)
    private String color;
    
    @Column(name = "manufacturing_year", nullable = false)
    private Integer manufacturingYear;
    
    @Column(name = "manufacturing_month", nullable = false)
    private Integer manufacturingMonth;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stockyard_id")
    private Stockyard stockyard;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.IN_TRANSIT;
    
    @Column(name = "purchase_price", precision = 12, scale = 2)
    private BigDecimal purchasePrice;
    
    @Column(name = "selling_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal sellingPrice;
    
    @Column(name = "arrival_date")
    private LocalDate arrivalDate;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
    
    @org.springframework.data.annotation.LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;
}
