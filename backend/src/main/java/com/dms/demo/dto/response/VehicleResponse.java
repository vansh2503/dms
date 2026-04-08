package com.dms.demo.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VehicleResponse {
    // Primary key — frontend accesses as vehicle.id
    private Long id;

    // Keep vehicleId for any references that use it directly
    @JsonProperty("vehicleId")
    public Long getVehicleId() { return id; }

    private String vin;
    private String chassisNumber;
    private String engineNumber;
    private String color;
    private Integer manufacturingYear;
    private Integer manufacturingMonth;
    private String status;

    // Price — frontend accesses as vehicle.price
    private BigDecimal price;

    @JsonProperty("sellingPrice")
    public BigDecimal getSellingPrice() { return price; }

    private BigDecimal purchasePrice;

    private LocalDate arrivalDate;

    // Model name — frontend accesses as vehicle.model
    private String model;

    @JsonProperty("modelName")
    public String getModelName() { return model; }

    // Variant ID — needed for edit form
    private Long variantId;

    // Variant name — frontend accesses as vehicle.variant
    private String variant;

    @JsonProperty("variantName")
    public String getVariantName() { return variant; }

    // Fuel type — frontend accesses as vehicle.fuelType
    private String fuelType;

    // Transmission — frontend may access as vehicle.transmissionType
    private String transmissionType;

    private String dealershipName;

    // Stockyard ID — needed for edit form
    private Long stockyardId;

    // Stockyard — frontend accesses as vehicle.stockyardLocation
    private String stockyardLocation;

    @JsonProperty("stockyardName")
    public String getStockyardName() { return stockyardLocation; }
}
