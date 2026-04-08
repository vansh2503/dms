package com.dms.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "dealerships")
@EntityListeners(AuditingEntityListener.class)
public class Dealership {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dealership_id")
    private Long dealershipId;
    
    @Column(name = "dealership_code", unique = true, nullable = false, length = 20)
    private String dealershipCode;
    
    @Column(name = "dealership_name", nullable = false, length = 100)
    private String dealershipName;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @Column(nullable = false, length = 50)
    private String city;
    
    @Column(nullable = false, length = 50)
    private String state;
    
    @Column(nullable = false, length = 10)
    private String pincode;
    
    @Column(nullable = false, length = 15)
    private String phone;
    
    @Column(length = 100)
    private String email;
    
    @Column(name = "manager_name", length = 100)
    private String managerName;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
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
