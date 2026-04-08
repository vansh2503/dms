package com.dms.demo.service.impl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dms.demo.dto.request.CustomerRequest;
import com.dms.demo.dto.response.AccessoryOrderResponse;
import com.dms.demo.dto.response.BookingResponse;
import com.dms.demo.dto.response.Customer360Response;
import com.dms.demo.dto.response.CustomerResponse;
import com.dms.demo.dto.response.ExchangeResponse;
import com.dms.demo.dto.response.PagedResponse;
import com.dms.demo.dto.response.TestDriveResponse;
import com.dms.demo.entity.AccessoryOrder;
import com.dms.demo.entity.Booking;
import com.dms.demo.entity.Customer;
import com.dms.demo.entity.ExchangeRequest;
import com.dms.demo.entity.TestDrive;
import com.dms.demo.enums.CustomerType;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.AccessoryOrderRepository;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.repository.CustomerRepository;
import com.dms.demo.repository.ExchangeRequestRepository;
import com.dms.demo.repository.TestDriveRepository;
import com.dms.demo.service.CustomerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final TestDriveRepository testDriveRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final AccessoryOrderRepository accessoryOrderRepository;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (customerRepository.existsByPhoneAndIsActiveTrue(request.getPhone())) {
            throw new BadRequestException("An active customer with this phone number already exists");
        }
        
        if (request.getEmail() != null && customerRepository.existsByEmailAndIsActiveTrue(request.getEmail())) {
            throw new BadRequestException("An active customer with this email already exists");
        }

        Customer customer = new Customer();
        mapRequestToEntity(request, customer);
        customer = customerRepository.save(customer);
        return mapToResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Check phone uniqueness
        if (!customer.getPhone().equals(request.getPhone()) && 
            customerRepository.existsByPhoneAndIsActiveTrue(request.getPhone())) {
            throw new BadRequestException("An active customer with this phone number already exists");
        }

        // Check email uniqueness
        if (request.getEmail() != null && 
            !request.getEmail().equals(customer.getEmail()) && 
            customerRepository.existsByEmailAndIsActiveTrue(request.getEmail())) {
            throw new BadRequestException("An active customer with this email already exists");
        }

        mapRequestToEntity(request, customer);
        customer = customerRepository.save(customer);
        return mapToResponse(customer);
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return mapToResponse(customer);
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAllByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PagedResponse<CustomerResponse> getAllCustomersPaged(String search, Pageable pageable) {
        Page<Customer> page;
        if (search != null && !search.trim().isEmpty()) {
            page = customerRepository.searchByKeywordPageable(search.trim(), pageable);
        } else {
            page = customerRepository.findAllByIsActiveTrue(pageable);
        }
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public List<CustomerResponse> searchCustomers(String keyword) {
        return customerRepository.searchByKeyword(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse searchByPhone(String phone) {
        Customer customer = customerRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with phone: " + phone));
        return mapToResponse(customer);
    }

    @Override
    public CustomerResponse searchByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return mapToResponse(customer);
    }

    @Override
    public List<BookingResponse> getCustomerBookings(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found");
        }

        List<Booking> bookings = bookingRepository.findByCustomerCustomerId(customerId);
        return bookings.stream()
                .map(this::mapBookingToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Customer360Response getCustomer360View(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Customer360Response response = new Customer360Response();
        response.setCustomer(mapToResponse(customer));

        // Get all bookings
        List<Booking> bookings = bookingRepository.findByCustomerCustomerId(customerId);
        response.setBookings(bookings.stream()
                .map(this::mapBookingToResponse)
                .collect(Collectors.toList()));

        // Get all test drives
        List<TestDrive> testDrives = testDriveRepository.findByCustomerCustomerId(customerId);
        response.setTestDrives(testDrives.stream()
                .map(this::mapTestDriveToResponse)
                .collect(Collectors.toList()));

        // Get all exchange requests
        List<ExchangeRequest> exchangeRequests = exchangeRequestRepository.findByCustomerCustomerId(customerId);
        response.setExchangeRequests(exchangeRequests.stream()
                .map(this::mapExchangeToResponse)
                .collect(Collectors.toList()));

        // Get all accessory orders
        List<AccessoryOrder> accessoryOrders = accessoryOrderRepository.findByCustomerId(customerId);
        response.setAccessoryOrders(accessoryOrders.stream()
                .map(this::mapAccessoryOrderToResponse)
                .collect(Collectors.toList()));

        // Calculate statistics
        Customer360Response.CustomerStatistics stats = new Customer360Response.CustomerStatistics();
        stats.setTotalBookings((long) bookings.size());
        stats.setCompletedBookings(bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus().name()))
                .count());
        stats.setCancelledBookings(bookings.stream()
                .filter(b -> "CANCELLED".equals(b.getStatus().name()))
                .count());
        stats.setTotalTestDrives((long) testDrives.size());
        stats.setTotalExchangeRequests((long) exchangeRequests.size());
        stats.setTotalAccessoryOrders((long) accessoryOrders.size());
        stats.setTotalLoyaltyPoints(customer.getLoyaltyPoints());
        response.setStatistics(stats);

        return response;
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Override
    public List<CustomerResponse> getCustomersWithFilters(String search, String city, CustomerType customerType, LocalDate fromDate, LocalDate toDate) {
        List<Customer> customers = customerRepository.findWithFilters(search, city, customerType, fromDate, toDate);
        return customers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<CustomerResponse> importCustomersFromCsv(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("CSV file is empty");
        }

        List<CustomerResponse> importedCustomers = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }

                String[] fields = line.split(",", -1);
                if (fields.length < 10) {
                    continue; // Skip invalid rows
                }

                try {
                    Customer customer = new Customer();
                    customer.setFirstName(fields[0].trim());
                    customer.setLastName(fields[1].trim());
                    customer.setEmail(fields[2].trim().isEmpty() ? null : fields[2].trim());
                    customer.setPhone(fields[3].trim());
                    customer.setAlternatePhone(fields[4].trim().isEmpty() ? null : fields[4].trim());
                    customer.setAddress(fields[5].trim().isEmpty() ? null : fields[5].trim());
                    customer.setCity(fields[6].trim().isEmpty() ? null : fields[6].trim());
                    customer.setState(fields[7].trim().isEmpty() ? null : fields[7].trim());
                    customer.setPincode(fields[8].trim().isEmpty() ? null : fields[8].trim());
                    
                    if (!fields[9].trim().isEmpty()) {
                        customer.setDateOfBirth(LocalDate.parse(fields[9].trim(), dateFormatter));
                    }
                    
                    if (fields.length > 10 && !fields[10].trim().isEmpty()) {
                        customer.setAnniversaryDate(LocalDate.parse(fields[10].trim(), dateFormatter));
                    }
                    
                    if (fields.length > 11) {
                        customer.setPanNumber(fields[11].trim().isEmpty() ? null : fields[11].trim());
                    }
                    
                    if (fields.length > 12) {
                        customer.setAadharNumber(fields[12].trim().isEmpty() ? null : fields[12].trim());
                    }
                    
                    if (fields.length > 13) {
                        customer.setDrivingLicense(fields[13].trim().isEmpty() ? null : fields[13].trim());
                    }
                    
                    if (fields.length > 14 && !fields[14].trim().isEmpty()) {
                        customer.setCustomerType(CustomerType.valueOf(fields[14].trim().toUpperCase()));
                    } else {
                        customer.setCustomerType(CustomerType.INDIVIDUAL);
                    }
                    
                    if (fields.length > 15 && !fields[15].trim().isEmpty()) {
                        customer.setLoyaltyPoints(Integer.parseInt(fields[15].trim()));
                    } else {
                        customer.setLoyaltyPoints(0);
                    }
                    
                    if (fields.length > 16) {
                        customer.setReferredBy(fields[16].trim().isEmpty() ? null : fields[16].trim());
                    }
                    
                    if (fields.length > 17) {
                        customer.setNotes(fields[17].trim().isEmpty() ? null : fields[17].trim());
                    }

                    // Skip if active phone already exists
                    if (customerRepository.existsByPhoneAndIsActiveTrue(customer.getPhone())) {
                        continue;
                    }

                    customer = customerRepository.save(customer);
                    importedCustomers.add(mapToResponse(customer));
                } catch (Exception e) {
                    // Skip invalid rows and continue processing
                }
            }
        } catch (Exception e) {
            throw new BadRequestException("Error processing CSV file: " + e.getMessage());
        }

        return importedCustomers;
    }

    private void mapRequestToEntity(CustomerRequest request, Customer customer) {
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAlternatePhone(request.getAlternatePhone());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setPincode(request.getPincode());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setAnniversaryDate(request.getAnniversaryDate());
        customer.setPanNumber(request.getPanNumber());
        customer.setAadharNumber(request.getAadharNumber());
        customer.setDrivingLicense(request.getDrivingLicense());
        customer.setCustomerType(request.getCustomerType());
        customer.setLoyaltyPoints(request.getLoyaltyPoints() != null ? request.getLoyaltyPoints() : 0);
        customer.setReferredBy(request.getReferredBy());
        customer.setNotes(request.getNotes());
    }

    private CustomerResponse mapToResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setCustomerId(customer.getCustomerId());
        response.setFirstName(customer.getFirstName());
        response.setLastName(customer.getLastName());
        response.setFullName(customer.getFirstName() + " " + customer.getLastName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setAlternatePhone(customer.getAlternatePhone());
        response.setAddress(customer.getAddress());
        response.setCity(customer.getCity());
        response.setState(customer.getState());
        response.setPincode(customer.getPincode());
        response.setDateOfBirth(customer.getDateOfBirth());
        response.setAnniversaryDate(customer.getAnniversaryDate());
        response.setPanNumber(customer.getPanNumber());
        response.setAadharNumber(customer.getAadharNumber());
        response.setDrivingLicense(customer.getDrivingLicense());
        response.setCustomerType(customer.getCustomerType());
        response.setLoyaltyPoints(customer.getLoyaltyPoints());
        response.setReferredBy(customer.getReferredBy());
        response.setNotes(customer.getNotes());
        return response;
    }

    private BookingResponse mapBookingToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setBookingNumber(booking.getBookingNumber());
        response.setCustomerName(booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName());
        response.setVariantName(booking.getVehicle().getVariant().getVariantName());
        response.setDealershipName(booking.getDealership().getDealershipName());
        response.setSalesExecutiveName(booking.getSalesExecutive() != null ? booking.getSalesExecutive().getFullName() : null);
        response.setBookingAmount(booking.getBookingAmount());
        response.setBookingDate(booking.getBookingDate());
        response.setExpectedDeliveryDate(booking.getExpectedDeliveryDate());
        response.setStatus(booking.getStatus().name());
        return response;
    }

    private TestDriveResponse mapTestDriveToResponse(TestDrive testDrive) {
        TestDriveResponse response = new TestDriveResponse();
        response.setTestDriveId(testDrive.getTestDriveId());
        response.setCustomerName(testDrive.getCustomer().getFirstName() + " " + testDrive.getCustomer().getLastName());
        response.setVehicleVin(testDrive.getVehicle().getVin());
        response.setVariantName(testDrive.getVehicle().getVariant().getVariantName());
        response.setDealershipName(testDrive.getDealership().getDealershipName());
        response.setSalesExecutiveName(testDrive.getSalesExecutive() != null ? testDrive.getSalesExecutive().getFullName() : null);
        response.setScheduledDate(testDrive.getScheduledDate());
        response.setScheduledTime(testDrive.getScheduledTime());
        response.setStatus(testDrive.getStatus().name());
        response.setFeedback(testDrive.getFeedback());
        return response;
    }

    private ExchangeResponse mapExchangeToResponse(ExchangeRequest exchange) {
        ExchangeResponse response = new ExchangeResponse();
        response.setExchangeId(exchange.getExchangeId());
        response.setBookingId(exchange.getBooking().getBookingId());
        response.setCustomerName(exchange.getCustomer().getFirstName() + " " + exchange.getCustomer().getLastName());
        response.setOldVehicleMake(exchange.getOldVehicleMake());
        response.setOldVehicleModel(exchange.getOldVehicleModel());
        response.setOldVehicleYear(exchange.getOldVehicleYear());
        response.setOldVehicleRegistration(exchange.getOldVehicleRegistration());
        response.setOldVehicleKmDriven(exchange.getOldVehicleKmDriven());
        response.setValuationAmount(exchange.getValuationAmount());
        response.setOfferedAmount(exchange.getOfferedAmount());
        response.setStatus(exchange.getStatus().name());
        response.setEvaluationDate(exchange.getEvaluationDate());
        return response;
    }

    private AccessoryOrderResponse mapAccessoryOrderToResponse(AccessoryOrder order) {
        AccessoryOrderResponse response = new AccessoryOrderResponse();
        response.setOrderId(order.getOrderId());
        response.setBookingId(order.getBooking().getBookingId());
        response.setBookingNumber(order.getBooking().getBookingNumber());
        response.setCustomerName(order.getBooking().getCustomer().getFirstName() + " " + 
                                 order.getBooking().getCustomer().getLastName());
        response.setTotalAmount(order.getTotalPrice());
        response.setInstallationRequired(order.getInstallationRequired());
        response.setInstallationDate(order.getInstallationDate());
        response.setStatus(order.getStatus().name());
        return response;
    }
}
