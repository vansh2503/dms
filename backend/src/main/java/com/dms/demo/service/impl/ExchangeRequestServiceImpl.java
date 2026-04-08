package com.dms.demo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dms.demo.dto.request.ExchangeRequestDto;
import com.dms.demo.dto.response.ExchangeResponse;
import com.dms.demo.entity.Booking;
import com.dms.demo.entity.Customer;
import com.dms.demo.entity.ExchangeRequest;
import com.dms.demo.enums.ExchangeStatus;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.repository.CustomerRepository;
import com.dms.demo.repository.ExchangeRequestRepository;
import com.dms.demo.repository.UserRepository;
import com.dms.demo.service.ExchangeRequestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExchangeRequestServiceImpl implements ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ExchangeResponse createExchangeRequest(ExchangeRequestDto request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        ExchangeRequest exchangeRequest = new ExchangeRequest();
        exchangeRequest.setBooking(booking);
        exchangeRequest.setCustomer(customer);
        exchangeRequest.setOldVehicleMake(request.getOldVehicleMake());
        exchangeRequest.setOldVehicleModel(request.getOldVehicleModel());
        exchangeRequest.setOldVehicleVariant(request.getOldVehicleVariant());
        exchangeRequest.setOldVehicleYear(request.getOldVehicleYear());
        exchangeRequest.setOldVehicleRegistration(request.getOldVehicleRegistration());
        exchangeRequest.setOldVehicleKmDriven(request.getOldVehicleKmDriven());
        exchangeRequest.setOldVehicleCondition(request.getOldVehicleCondition());
        exchangeRequest.setRemarks(request.getRemarks());
        exchangeRequest.setStatus(ExchangeStatus.PENDING);

        exchangeRequest = exchangeRequestRepository.save(exchangeRequest);
        return mapToResponse(exchangeRequest);
    }

    @Override
    public ExchangeResponse getExchangeById(Long id) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));
        return mapToResponse(exchangeRequest);
    }

    @Override
    public List<ExchangeResponse> getAllExchanges() {
        List<ExchangeRequest> requests = exchangeRequestRepository.findAll();
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ExchangeResponse> getExchangesByBooking(Long bookingId) {
        List<ExchangeRequest> requests = exchangeRequestRepository.findByBookingBookingId(bookingId);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ExchangeResponse> getExchangesByCustomer(Long customerId) {
        List<ExchangeRequest> requests = exchangeRequestRepository.findByCustomerCustomerId(customerId);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ExchangeResponse> getExchangesByStatus(ExchangeStatus status) {
        List<ExchangeRequest> requests = exchangeRequestRepository.findByStatus(status);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ExchangeResponse> getExchangesWithFilters(String search, ExchangeStatus status, 
                                                           Long vehicleId, LocalDate fromDate, LocalDate toDate) {
        List<ExchangeRequest> requests = exchangeRequestRepository.findWithFilters(
            search, status, vehicleId, fromDate, toDate);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExchangeResponse evaluateExchange(Long id, BigDecimal offeredAmount) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));

        if (exchangeRequest.getStatus() != ExchangeStatus.PENDING) {
            throw new BadRequestException("Can only evaluate pending exchange requests");
        }

        exchangeRequest.setOfferedAmount(offeredAmount);
        exchangeRequest.setValuationAmount(offeredAmount);
        exchangeRequest.setStatus(ExchangeStatus.EVALUATED);
        exchangeRequest.setEvaluationDate(LocalDate.now());

        // Set evaluator
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByUsername(username).ifPresent(exchangeRequest::setEvaluatedBy);

        exchangeRequest = exchangeRequestRepository.save(exchangeRequest);
        return mapToResponse(exchangeRequest);
    }

    @Override
    @Transactional
    public ExchangeResponse updateStatus(Long id, ExchangeStatus status) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));

        if (exchangeRequest.getStatus() == ExchangeStatus.COMPLETED) {
            throw new BadRequestException("Cannot update completed exchange request");
        }

        exchangeRequest.setStatus(status);
        exchangeRequest = exchangeRequestRepository.save(exchangeRequest);
        return mapToResponse(exchangeRequest);
    }

    private ExchangeResponse mapToResponse(ExchangeRequest request) {
        ExchangeResponse response = new ExchangeResponse();
        response.setExchangeId(request.getExchangeId());
        response.setBookingId(request.getBooking().getBookingId());
        response.setBookingNumber(request.getBooking().getBookingNumber());
        response.setCustomerId(request.getCustomer().getCustomerId());
        response.setCustomerName(request.getCustomer().getFirstName() + " " +
                request.getCustomer().getLastName());
        // Old vehicle
        response.setOldVehicleMake(request.getOldVehicleMake());
        response.setOldVehicleModel(request.getOldVehicleModel());
        response.setOldVehicleVariant(request.getOldVehicleVariant());
        response.setOldVehicleYear(request.getOldVehicleYear());
        response.setOldVehicleRegistration(request.getOldVehicleRegistration());
        response.setOldVehicleKmDriven(request.getOldVehicleKmDriven());
        response.setOldVehicleCondition(request.getOldVehicleCondition());
        // New vehicle from booking variant
        if (request.getBooking().getVariant() != null) {
            response.setNewVehicleVariant(request.getBooking().getVariant().getVariantName());
            if (request.getBooking().getVariant().getModel() != null) {
                response.setNewVehicleModel(request.getBooking().getVariant().getModel().getModelName());
            }
        }
        // Valuation
        response.setValuationAmount(request.getValuationAmount());
        response.setOfferedAmount(request.getOfferedAmount());
        // Meta
        response.setStatus(request.getStatus().name());
        response.setEvaluationDate(request.getEvaluationDate());
        if (request.getEvaluatedBy() != null) {
            response.setEvaluatedBy(request.getEvaluatedBy().getFullName());
        }
        response.setRemarks(request.getRemarks());
        if (request.getCreatedAt() != null) {
            response.setCreatedAt(request.getCreatedAt().toLocalDate());
        }
        return response;
    }
}
