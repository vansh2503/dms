package com.dms.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.dms.demo.dto.request.SalesTransactionRequest;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.dto.response.SalesTransactionResponse;

public interface SalesTransactionService {
    SalesTransactionResponse createTransaction(SalesTransactionRequest request);
    SalesTransactionResponse getTransactionById(Long id);
    List<SalesTransactionResponse> getTransactionsByDealership(Long dealershipId);
    List<SalesTransactionResponse> getTransactionsByDateRange(LocalDate from, LocalDate to);
    PagedResponse<SalesTransactionResponse> getAllTransactionsPaged(Pageable pageable);
    PagedResponse<SalesTransactionResponse> getTransactionsByDealershipPaged(Long dealershipId, Pageable pageable);
}
