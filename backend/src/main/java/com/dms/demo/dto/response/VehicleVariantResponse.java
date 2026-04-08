package com.dms.demo.dto.response;

import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class VehicleVariantResponse {
    private Long id;
    private String model;
    private String variantName;
    private String variantCode;
    private FuelType fuelType;
    private TransmissionType transmission;
    private String engineCC;
    private String maxPower;
    private String maxTorque;
    private Integer seatingCapacity;
    private String groundClearance;
    private String bootSpace;
    private Integer airbags;
    private String araiMileage;
    private String features;
    private BigDecimal price;
    private BigDecimal exShowroomPrice;
    private Boolean isActive;
}
