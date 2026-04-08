package com.dms.demo.controller;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.entity.SystemSettings;
import com.dms.demo.repository.SystemSettingsRepository;
import com.dms.demo.service.AuditService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SystemSettingsController {

    private final SystemSettingsRepository repository;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {
        Map<String, String> settings = repository.findAll().stream()
                .collect(Collectors.toMap(SystemSettings::getSettingKey, SystemSettings::getSettingValue));
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<String>> updateSettings(@RequestBody Map<String, String> settings) {
        settings.forEach((key, value) -> {
            SystemSettings setting = repository.findById(key).orElse(new SystemSettings());
            setting.setSettingKey(key);
            setting.setSettingValue(value);
            repository.save(setting);
        });
        auditService.log("UPDATE_SETTINGS", "Admin", "Updated global system configurations: " + settings.keySet());
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully"));
    }
}
