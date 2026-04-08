package com.dms.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dms.demo.dto.request.CustomerRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.response.BookingResponse;
import com.dms.demo.dto.response.Customer360Response;
import com.dms.demo.dto.response.CustomerResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.enums.CustomerType;
import com.dms.demo.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(customerService.createCustomer(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> update(@PathVariable Long id,
                                                    @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.success(customerService.updateCustomer(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerById(id)));
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) CustomerType customerType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "firstName") String sort,
            @RequestParam(required = false, defaultValue = "asc") String dir) {

        // If any filter is provided, use filter method
        if (city != null || customerType != null || fromDate != null || toDate != null) {
            List<CustomerResponse> filtered = customerService.getCustomersWithFilters(
                search.isEmpty() ? null : search, 
                city, 
                customerType, 
                fromDate, 
                toDate
            );
            return ResponseEntity.ok(ApiResponse.success(filtered));
        }

        // If page param is present, return paginated response
        if (page != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
            PagedResponse<CustomerResponse> paged = customerService.getAllCustomersPaged(search, pageable);
            return ResponseEntity.ok(ApiResponse.success(paged));
        }

        // Legacy: return flat list (keeps existing frontend working)
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(customerService.searchCustomers(search)));
        }
        return ResponseEntity.ok(ApiResponse.success(customerService.getAllCustomers()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(customerService.searchCustomers(keyword)));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<ApiResponse<CustomerResponse>> searchByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(ApiResponse.success(customerService.searchByPhone(phone)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<CustomerResponse>> searchByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success(customerService.searchByEmail(email)));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getCustomerBookings(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerBookings(id)));
    }

    @GetMapping("/{id}/360")
    public ResponseEntity<ApiResponse<Customer360Response>> getCustomer360View(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomer360View(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<CustomerResponse>> importFromCsv(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(customerService.importCustomersFromCsv(file));
    }
}
