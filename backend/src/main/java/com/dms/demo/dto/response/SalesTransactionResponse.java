package com.dms.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class SalesTransactionResponse {
    private Long transactionId;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private String customerName;
    private String vehicleVin;
    private String variantName;
    private String dealershipName;
    private String salesExecutiveName;
    private LocalDate saleDate;
    private BigDecimal vehiclePrice;
    private BigDecimal accessoriesPrice;
    private BigDecimal insuranceAmount;
    private BigDecimal registrationCharges;
    private BigDecimal otherCharges;
    private BigDecimal discountAmount;
    private BigDecimal exchangeValue;
    private BigDecimal totalAmount;
    private String paymentMode;
    private String financeCompany;
    private BigDecimal loanAmount;
    private BigDecimal downPayment;
}
