package com.dms.demo.entity;

import com.dms.demo.enums.CustomerType;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_phone", columnList = "phone"),
    @Index(name = "idx_customer_email", columnList = "email"),
    @Index(name = "idx_customer_active", columnList = "is_active"),
    @Index(name = "idx_customer_name", columnList = "first_name, last_name")
})
@EntityListeners(AuditingEntityListener.class)
@org.hibernate.annotations.SQLDelete(sql = "UPDATE customers SET is_active = false WHERE customer_id = ?")
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;
    
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;
    
    @Column(length = 100)
    private String email;
    
    @Column(nullable = false, length = 15)
    private String phone;
    
    @Column(name = "alternate_phone", length = 15)
    private String alternatePhone;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(length = 50)
    private String city;
    
    @Column(length = 50)
    private String state;
    
    @Column(length = 10)
    private String pincode;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "anniversary_date")
    private LocalDate anniversaryDate;
    
    @Column(name = "pan_number", length = 10)
    private String panNumber;
    
    @Column(name = "aadhar_number", length = 12)
    private String aadharNumber;
    
    @Column(name = "driving_license", length = 20)
    private String drivingLicense;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type", nullable = false)
    private CustomerType customerType = CustomerType.INDIVIDUAL;
    
    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;
    
    @Column(name = "referred_by", length = 100)
    private String referredBy;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
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

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean isActive = true;
}
