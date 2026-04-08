package com.dms.demo.controller;

import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.entity.VehicleModel;
import com.dms.demo.repository.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class VehicleModelController {

    private final VehicleModelRepository modelRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleModel>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(modelRepository.findAll()));
    }
}
