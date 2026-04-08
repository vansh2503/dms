package com.dms.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.dms.demo.dto.request.CustomerRequest;
import com.dms.demo.dto.response.BookingResponse;
import com.dms.demo.dto.response.Customer360Response;
import com.dms.demo.dto.response.CustomerResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.enums.CustomerType;

public interface CustomerService {
    CustomerResponse createCustomer(CustomerRequest request);
    CustomerResponse updateCustomer(Long id, CustomerRequest request);
    CustomerResponse getCustomerById(Long id);
    List<CustomerResponse> getAllCustomers();
    PagedResponse<CustomerResponse> getAllCustomersPaged(String search, Pageable pageable);
    List<CustomerResponse> searchCustomers(String keyword);
    CustomerResponse searchByPhone(String phone);
    CustomerResponse searchByEmail(String email);
    List<BookingResponse> getCustomerBookings(Long customerId);
    Customer360Response getCustomer360View(Long customerId);
    void deleteCustomer(Long id);
    List<CustomerResponse> importCustomersFromCsv(MultipartFile file);
    List<CustomerResponse> getCustomersWithFilters(String search, String city, CustomerType customerType, LocalDate fromDate, LocalDate toDate);
}
