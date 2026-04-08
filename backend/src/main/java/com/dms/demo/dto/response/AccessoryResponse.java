package com.dms.demo.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccessoryResponse {
    private Long id;
    private String name;
    private String code;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isActive;
}
