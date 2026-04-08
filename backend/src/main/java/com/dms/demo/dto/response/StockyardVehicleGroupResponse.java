package com.dms.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockyardVehicleGroupResponse {
    private Long stockyardId;
    private String stockyardName;
    private String location;
    private Integer totalVehicles;
    private List<VehicleResponse> vehicles;
}
