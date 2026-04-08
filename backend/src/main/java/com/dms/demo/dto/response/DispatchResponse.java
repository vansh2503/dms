package com.dms.demo.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class DispatchResponse {
    private Long dispatchId;
    private Long bookingId;
    private String vehicleVin;
    private String customerName;
    private LocalDate dispatchDate;
    private LocalTime dispatchTime;
    private String deliveryLocation;
    private Boolean documentsHandedOver;
    private Boolean keysHandedOver;
    private Boolean customerSignature;
}
