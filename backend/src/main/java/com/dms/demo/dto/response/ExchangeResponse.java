package com.dms.demo.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExchangeResponse {
    private Long exchangeId;
    private Long bookingId;
    private String bookingNumber;
    private String customerName;
    private Long customerId;
    // Old vehicle
    private String oldVehicleMake;
    private String oldVehicleModel;
    private String oldVehicleVariant;
    private Integer oldVehicleYear;
    private String oldVehicleRegistration;
    private Integer oldVehicleKmDriven;
    private String oldVehicleCondition;
    // New vehicle (from booking)
    private String newVehicleModel;
    private String newVehicleVariant;
    // Valuation
    private BigDecimal valuationAmount;
    private BigDecimal offeredAmount;
    // Meta
    private String status;
    private LocalDate evaluationDate;
    private String evaluatedBy;
    private String remarks;
    private LocalDate createdAt;
}
