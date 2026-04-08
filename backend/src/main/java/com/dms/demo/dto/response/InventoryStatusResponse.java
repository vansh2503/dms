package com.dms.demo.dto.response;

import com.dms.demo.enums.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryStatusResponse {
    private VehicleStatus status;
    private Long count;
}
