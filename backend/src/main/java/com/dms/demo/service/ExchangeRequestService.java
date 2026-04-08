package com.dms.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.dms.demo.dto.request.ExchangeRequestDto;
import com.dms.demo.dto.response.ExchangeResponse;
import com.dms.demo.enums.ExchangeStatus;

public interface ExchangeRequestService {
    ExchangeResponse createExchangeRequest(ExchangeRequestDto request);
    ExchangeResponse getExchangeById(Long id);
    List<ExchangeResponse> getAllExchanges();
    List<ExchangeResponse> getExchangesByBooking(Long bookingId);
    List<ExchangeResponse> getExchangesByCustomer(Long customerId);
    List<ExchangeResponse> getExchangesByStatus(ExchangeStatus status);
    List<ExchangeResponse> getExchangesWithFilters(String search, ExchangeStatus status, Long vehicleId, LocalDate fromDate, LocalDate toDate);
    ExchangeResponse evaluateExchange(Long id, BigDecimal offeredAmount);
    ExchangeResponse updateStatus(Long id, ExchangeStatus status);
}
