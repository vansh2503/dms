package com.dms.demo.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SalesSummaryResponse {
    private Integer year;
    private Integer month;
    private Long totalSales;
    private BigDecimal totalRevenue;
    private BigDecimal averageTransactionValue;
}
