package com.dms.demo.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopModelResponse {
    private String modelName;
    private String variantName;
    private Long salesCount;
    private BigDecimal totalRevenue;
}
