package com.dms.demo.entity;

import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vehicle_variants", indexes = {
    @Index(name = "idx_variant_model", columnList = "model_id"),
    @Index(name = "idx_variant_code", columnList = "variant_code"),
    @Index(name = "idx_variant_active", columnList = "is_active"),
    @Index(name = "idx_variant_fuel", columnList = "fuel_type")
})
@EntityListeners(AuditingEntityListener.class)
public class VehicleVariant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long variantId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private VehicleModel model;
    
    @Column(name = "variant_name", nullable = false, length = 100)
    private String variantName;
    
    @Column(name = "variant_code", unique = true, nullable = false, length = 30)
    private String variantCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false)
    private FuelType fuelType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransmissionType transmission;
    
    @Column(name = "engine_capacity", length = 20)
    private String engineCapacity;
    
    @Column(name = "max_power", length = 50)
    private String maxPower;
    
    @Column(name = "max_torque", length = 50)
    private String maxTorque;
    
    @Column(name = "seating_capacity")
    private Integer seatingCapacity;
    
    @Column(name = "ground_clearance", length = 20)
    private String groundClearance;
    
    @Column(name = "boot_space", length = 20)
    private String bootSpace;
    
    @Column(name = "airbags")
    private Integer airbags;
    
    @Column(name = "arai_mileage", length = 30)
    private String araiMileage;
    
    @Column(name = "features", columnDefinition = "TEXT")
    private String features;
    
    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;
    
    @Column(name = "ex_showroom_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal exShowroomPrice;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
}
