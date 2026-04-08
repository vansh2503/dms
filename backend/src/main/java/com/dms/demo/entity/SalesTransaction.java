package com.dms.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "sales_transactions", indexes = {
    @Index(name = "idx_sales_booking", columnList = "booking_id"),
    @Index(name = "idx_sales_vehicle", columnList = "vehicle_id"),
    @Index(name = "idx_sales_customer", columnList = "customer_id"),
    @Index(name = "idx_sales_dealership", columnList = "dealership_id"),
    @Index(name = "idx_sales_date", columnList = "sale_date"),
    @Index(name = "idx_sales_invoice", columnList = "invoice_number")
})
@EntityListeners(AuditingEntityListener.class)
public class SalesTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_executive_id", nullable = false)
    private User salesExecutive;
    
    @Column(name = "sale_date", nullable = false)
    private LocalDate saleDate;
    
    @Column(name = "vehicle_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal vehiclePrice;
    
    @Column(name = "accessories_price", precision = 12, scale = 2)
    private BigDecimal accessoriesPrice = BigDecimal.ZERO;
    
    @Column(name = "insurance_amount", precision = 12, scale = 2)
    private BigDecimal insuranceAmount = BigDecimal.ZERO;
    
    @Column(name = "registration_charges", precision = 12, scale = 2)
    private BigDecimal registrationCharges = BigDecimal.ZERO;
    
    @Column(name = "other_charges", precision = 12, scale = 2)
    private BigDecimal otherCharges = BigDecimal.ZERO;
    
    @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "exchange_value", precision = 12, scale = 2)
    private BigDecimal exchangeValue = BigDecimal.ZERO;
    
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "payment_mode", length = 30)
    private String paymentMode;
    
    @Column(name = "finance_company", length = 100)
    private String financeCompany;
    
    @Column(name = "loan_amount", precision = 12, scale = 2)
    private BigDecimal loanAmount;
    
    @Column(name = "down_payment", precision = 12, scale = 2)
    private BigDecimal downPayment;
    
    @Column(name = "invoice_number", unique = true, length = 50)
    private String invoiceNumber;
    
    @Column(name = "invoice_date")
    private LocalDate invoiceDate;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
}
