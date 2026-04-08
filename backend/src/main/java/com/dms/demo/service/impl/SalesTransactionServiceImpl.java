package com.dms.demo.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dms.demo.dto.request.SalesTransactionRequest;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.dto.response.SalesTransactionResponse;
import com.dms.demo.entity.Booking;
import com.dms.demo.entity.Customer;
import com.dms.demo.entity.Dealership;
import com.dms.demo.entity.SalesTransaction;
import com.dms.demo.entity.User;
import com.dms.demo.entity.Vehicle;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.repository.CustomerRepository;
import com.dms.demo.repository.DealershipRepository;
import com.dms.demo.repository.SalesTransactionRepository;
import com.dms.demo.repository.UserRepository;
import com.dms.demo.repository.VehicleRepository;
import com.dms.demo.service.SalesTransactionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SalesTransactionServiceImpl implements SalesTransactionService {

    private final SalesTransactionRepository salesTransactionRepository;
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;
    private final DealershipRepository dealershipRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public SalesTransactionResponse createTransaction(SalesTransactionRequest request) {
        log.info("Creating sales transaction: bookingId={}, vehicleId={}, totalAmount={}", 
                request.getBookingId(), request.getVehicleId(), request.getTotalAmount());
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));

        User salesExecutive = userRepository.findById(request.getSalesExecutiveId())
                .orElseThrow(() -> new ResourceNotFoundException("Sales executive not found"));

        SalesTransaction transaction = new SalesTransaction();
        transaction.setBooking(booking);
        transaction.setVehicle(vehicle);
        transaction.setCustomer(customer);
        transaction.setDealership(dealership);
        transaction.setSalesExecutive(salesExecutive);
        transaction.setSaleDate(request.getSaleDate());
        transaction.setVehiclePrice(request.getVehiclePrice());
        transaction.setAccessoriesPrice(request.getAccessoriesPrice());
        transaction.setInsuranceAmount(request.getInsuranceAmount());
        transaction.setRegistrationCharges(request.getRegistrationCharges());
        transaction.setOtherCharges(request.getOtherCharges());
        transaction.setDiscountAmount(request.getDiscountAmount());
        transaction.setExchangeValue(request.getExchangeValue());
        transaction.setTotalAmount(request.getTotalAmount());
        transaction.setPaymentMode(request.getPaymentMode());
        transaction.setFinanceCompany(request.getFinanceCompany());
        transaction.setLoanAmount(request.getLoanAmount());
        transaction.setDownPayment(request.getDownPayment());
        transaction.setInvoiceNumber(request.getInvoiceNumber());
        transaction.setInvoiceDate(request.getInvoiceDate());

        transaction = salesTransactionRepository.save(transaction);
        log.info("Sales transaction created successfully: transactionId={}, invoiceNumber={}, totalAmount={}", 
                transaction.getTransactionId(), transaction.getInvoiceNumber(), transaction.getTotalAmount());
        return mapToResponse(transaction);
    }

    @Override
    public SalesTransactionResponse getTransactionById(Long id) {
        SalesTransaction transaction = salesTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales transaction not found"));
        return mapToResponse(transaction);
    }

    @Override
    public List<SalesTransactionResponse> getTransactionsByDealership(Long dealershipId) {
        List<SalesTransaction> transactions = salesTransactionRepository
                .findByDealershipDealershipId(dealershipId);
        return transactions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<SalesTransactionResponse> getTransactionsByDateRange(LocalDate from, LocalDate to) {
        List<SalesTransaction> transactions = salesTransactionRepository
                .findBySaleDateBetween(from, to);
        return transactions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PagedResponse<SalesTransactionResponse> getAllTransactionsPaged(Pageable pageable) {
        return PagedResponse.of(
                salesTransactionRepository.findAll(pageable).map(this::mapToResponse));
    }

    @Override
    public PagedResponse<SalesTransactionResponse> getTransactionsByDealershipPaged(Long dealershipId, Pageable pageable) {
        return PagedResponse.of(
                salesTransactionRepository.findByDealershipDealershipId(dealershipId, pageable)
                        .map(this::mapToResponse));
    }

    private SalesTransactionResponse mapToResponse(SalesTransaction transaction) {
        SalesTransactionResponse response = new SalesTransactionResponse();
        response.setTransactionId(transaction.getTransactionId());
        response.setInvoiceNumber(transaction.getInvoiceNumber());
        response.setInvoiceDate(transaction.getInvoiceDate());
        response.setCustomerName(transaction.getCustomer().getFirstName() + " " + 
                transaction.getCustomer().getLastName());
        response.setVehicleVin(transaction.getVehicle().getVin());
        response.setVariantName(transaction.getVehicle().getVariant().getVariantName());
        response.setDealershipName(transaction.getDealership().getDealershipName());
        response.setSalesExecutiveName(transaction.getSalesExecutive().getFullName());
        response.setSaleDate(transaction.getSaleDate());
        response.setVehiclePrice(transaction.getVehiclePrice());
        response.setAccessoriesPrice(transaction.getAccessoriesPrice());
        response.setInsuranceAmount(transaction.getInsuranceAmount());
        response.setRegistrationCharges(transaction.getRegistrationCharges());
        response.setOtherCharges(transaction.getOtherCharges());
        response.setDiscountAmount(transaction.getDiscountAmount());
        response.setExchangeValue(transaction.getExchangeValue());
        response.setTotalAmount(transaction.getTotalAmount());
        response.setPaymentMode(transaction.getPaymentMode());
        response.setFinanceCompany(transaction.getFinanceCompany());
        response.setLoanAmount(transaction.getLoanAmount());
        response.setDownPayment(transaction.getDownPayment());
        return response;
    }
}
