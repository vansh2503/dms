package com.dms.demo.entity;

import com.dms.demo.enums.RefundStatus;
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
@Table(name = "booking_cancellations")
@EntityListeners(AuditingEntityListener.class)
public class BookingCancellation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cancellation_id")
    private Long cancellationId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @Column(name = "cancellation_date", nullable = false)
    private LocalDate cancellationDate;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
    
    @Column(name = "refund_amount", precision = 12, scale = 2)
    private BigDecimal refundAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "refund_status")
    private RefundStatus refundStatus = RefundStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_by", nullable = true)
    private User cancelledBy;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
}
