package com.dms.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalesTransactionRequest {
    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private Long bookingId;
    
    @NotNull(message = "Vehicle ID is required")
    @Positive(message = "Vehicle ID must be positive")
    private Long vehicleId;
    
    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;
    
    @NotNull(message = "Dealership ID is required")
    @Positive(message = "Dealership ID must be positive")
    private Long dealershipId;
    
    @NotNull(message = "Sales Executive ID is required")
    @Positive(message = "Sales Executive ID must be positive")
    private Long salesExecutiveId;
    
    @NotNull(message = "Sale date is required")
    @PastOrPresent(message = "Sale date cannot be in the future")
    private LocalDate saleDate;
    
    @NotNull(message = "Vehicle price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Vehicle price must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Vehicle price must have at most 12 integer digits and 2 decimal places")
    private BigDecimal vehiclePrice;
    
    @DecimalMin(value = "0.0", message = "Accessories price cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Accessories price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal accessoriesPrice;
    
    @DecimalMin(value = "0.0", message = "Insurance amount cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Insurance amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal insuranceAmount;
    
    @DecimalMin(value = "0.0", message = "Registration charges cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Registration charges must have at most 10 integer digits and 2 decimal places")
    private BigDecimal registrationCharges;
    
    @DecimalMin(value = "0.0", message = "Other charges cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Other charges must have at most 10 integer digits and 2 decimal places")
    private BigDecimal otherCharges;
    
    @DecimalMin(value = "0.0", message = "Discount amount cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Discount amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal discountAmount;
    
    @DecimalMin(value = "0.0", message = "Exchange value cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Exchange value must have at most 10 integer digits and 2 decimal places")
    private BigDecimal exchangeValue;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Total amount must have at most 12 integer digits and 2 decimal places")
    private BigDecimal totalAmount;
    
    @Size(max = 30, message = "Payment mode must not exceed 30 characters")
    private String paymentMode;
    
    @Size(max = 100, message = "Finance company must not exceed 100 characters")
    private String financeCompany;
    
    @DecimalMin(value = "0.0", message = "Loan amount cannot be negative")
    @Digits(integer = 12, fraction = 2, message = "Loan amount must have at most 12 integer digits and 2 decimal places")
    private BigDecimal loanAmount;
    
    @DecimalMin(value = "0.0", message = "Down payment cannot be negative")
    @Digits(integer = 12, fraction = 2, message = "Down payment must have at most 12 integer digits and 2 decimal places")
    private BigDecimal downPayment;
    
    @Size(max = 50, message = "Invoice number must not exceed 50 characters")
    private String invoiceNumber;
    
    @PastOrPresent(message = "Invoice date cannot be in the future")
    private LocalDate invoiceDate;
}
