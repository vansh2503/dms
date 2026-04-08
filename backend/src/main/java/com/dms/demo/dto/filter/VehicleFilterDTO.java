package com.dms.demo.dto.filter;

import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;
import com.dms.demo.enums.VehicleStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VehicleFilterDTO {
    private Long dealershipId;
    private VehicleStatus status;
    private String color;
    private Integer manufacturingYear;
    private Integer manufacturingYearFrom;
    private Integer manufacturingYearTo;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;
    private Long variantId;
    private Long modelId;
    private String model; // Model name for filtering
    private FuelType fuelType; // Fuel type filter
    private TransmissionType transmissionType; // Transmission type filter
    private LocalDate fromDate; // Arrival date from
    private LocalDate toDate; // Arrival date to
    private String search; // VIN, chassis, engine number
    private Long stockyardId;
}
