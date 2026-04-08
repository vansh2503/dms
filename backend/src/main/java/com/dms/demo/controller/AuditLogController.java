package com.dms.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.entity.AuditLog;
import com.dms.demo.repository.AuditLogRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository repository;

    /**
     * GET /api/audit-logs                     → all logs (legacy, for backward compatibility)
     * GET /api/audit-logs?page=0&size=20      → paginated logs
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "timestamp") String sort,
            @RequestParam(required = false, defaultValue = "desc") String dir) {

        // Paginated path
        if (page != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
            
            Page<AuditLog> auditPage = repository.findAll(pageable);
            PagedResponse<AuditLog> paged = PagedResponse.of(auditPage);
            
            return ResponseEntity.ok(ApiResponse.success(paged));
        }

        // Legacy flat-list path (for backward compatibility)
        List<AuditLog> logs = repository.findAllByOrderByTimestampDesc();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
