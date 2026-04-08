package com.dms.demo.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TestDriveResponse {
    private Long testDriveId;
    private String customerName;
    private String vehicleVin;
    private String vehicleModel;
    private String variantName;
    private String dealershipName;
    private String salesExecutiveName;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String scheduledDateTime;
    private String status;
    private String feedback;
}
