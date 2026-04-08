package com.dms.demo.entity;

import com.dms.demo.enums.TestDriveStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "test_drives", indexes = {
    @Index(name = "idx_testdrive_customer", columnList = "customer_id"),
    @Index(name = "idx_testdrive_vehicle", columnList = "vehicle_id"),
    @Index(name = "idx_testdrive_dealership", columnList = "dealership_id"),
    @Index(name = "idx_testdrive_status", columnList = "status"),
    @Index(name = "idx_testdrive_date", columnList = "scheduled_date")
})
@EntityListeners(AuditingEntityListener.class)
public class TestDrive {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_drive_id")
    private Long testDriveId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_executive_id", nullable = false)
    private User salesExecutive;
    
    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;
    
    @Column(name = "scheduled_time", nullable = false)
    private LocalTime scheduledTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestDriveStatus status = TestDriveStatus.SCHEDULED;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
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
