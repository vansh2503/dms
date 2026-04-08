package com.dms.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "system_settings")
public class SystemSettings {
    
    @Id
    private String settingKey; // e.g., "STORE_NAME", "TAX_RATE", "CURRENCY"
    
    @Column(nullable = false)
    private String settingValue;
    
    @Column
    private String description;
}
