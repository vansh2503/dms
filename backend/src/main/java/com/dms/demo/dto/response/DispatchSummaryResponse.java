package com.dms.demo.dto.response;

import lombok.Data;

@Data
public class DispatchSummaryResponse {
    private Long totalDispatches;
    private Long pendingDispatches;
    private Long completedDispatches;
    private Long inTransitDispatches;
}
