package com.dms.demo.controller;

import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.entity.Stockyard;
import com.dms.demo.repository.StockyardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stockyards")
@RequiredArgsConstructor
public class StockyardController {

    private final StockyardRepository stockyardRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Stockyard>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(stockyardRepository.findByIsActiveTrue()));
    }

    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<Stockyard>>> getStockyardsForDropdown(
            @RequestParam(required = false) Long dealershipId) {
        List<Stockyard> stockyards;
        if (dealershipId != null) {
            stockyards = stockyardRepository.findByDealershipDealershipIdAndIsActiveTrue(dealershipId);
        } else {
            stockyards = stockyardRepository.findByIsActiveTrue();
        }
        return ResponseEntity.ok(ApiResponse.success(stockyards));
    }
}
