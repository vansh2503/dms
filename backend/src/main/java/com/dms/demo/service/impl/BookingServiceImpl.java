package com.dms.demo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dms.demo.dto.filter.BookingFilterDTO;
import com.dms.demo.dto.request.BookingRequest;
import com.dms.demo.dto.response.BookingResponse;
import com.dms.demo.entity.Booking;
import com.dms.demo.entity.BookingCancellation;
import com.dms.demo.entity.Customer;
import com.dms.demo.entity.Dealership;
import com.dms.demo.entity.User;
import com.dms.demo.entity.Vehicle;
import com.dms.demo.entity.VehicleVariant;
import com.dms.demo.enums.BookingStatus;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.BookingCancellationRepository;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.repository.CustomerRepository;
import com.dms.demo.repository.DealershipRepository;
import com.dms.demo.repository.UserRepository;
import com.dms.demo.repository.VehicleRepository;
import com.dms.demo.repository.VehicleVariantRepository;
import com.dms.demo.repository.specification.BookingSpecification;
import com.dms.demo.service.BookingService;
import com.dms.demo.util.BookingNumberGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleVariantRepository variantRepository;
    private final DealershipRepository dealershipRepository;
    private final UserRepository userRepository;
    private final BookingCancellationRepository cancellationRepository;
    private final BookingNumberGenerator bookingNumberGenerator;

    @Override
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public BookingResponse createBooking(BookingRequest request) {
        log.info("Creating booking for customer: {}, variant: {}", request.getCustomerId(), request.getVariantId());
        
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        VehicleVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));

        User salesExecutive = userRepository.findById(request.getSalesExecutiveId())
                .orElseThrow(() -> new ResourceNotFoundException("Sales executive not found"));

        Vehicle vehicle = null;
        if (request.getVehicleId() != null) {
            vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

            if (vehicle.getStatus() == VehicleStatus.BOOKED || 
                vehicle.getStatus() == VehicleStatus.SOLD ||
                vehicle.getStatus() == VehicleStatus.DISPATCHED) {
                log.warn("Vehicle booking failed - vehicle not available: vehicleId={}, status={}", 
                        vehicle.getVehicleId(), vehicle.getStatus());
                throw new BadRequestException("Vehicle is not available for booking. Current status: " + vehicle.getStatus());
            }

            List<Booking> existingBookings = bookingRepository.findByVehicleVehicleIdAndStatusIn(
                    vehicle.getVehicleId(), 
                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
            );
            
            if (!existingBookings.isEmpty()) {
                log.warn("Vehicle booking failed - vehicle already has active booking: vehicleId={}", vehicle.getVehicleId());
                throw new BadRequestException("Vehicle already has an active booking");
            }

            vehicle.setStatus(VehicleStatus.BOOKED);
            vehicleRepository.save(vehicle);
        }

        Long sequenceNumber = bookingRepository.count() + 1;
        String bookingNumber = bookingNumberGenerator.generateBookingNumber(sequenceNumber);

        Booking booking = new Booking();
        booking.setBookingNumber(bookingNumber);
        booking.setCustomer(customer);
        booking.setVehicle(vehicle);
        booking.setVariant(variant);
        booking.setDealership(dealership);
        booking.setSalesExecutive(salesExecutive);
        booking.setBookingAmount(request.getBookingAmount());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setBookingDate(request.getBookingDate());
        booking.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        booking.setPaymentMode(request.getPaymentMode());
        booking.setRemarks(request.getRemarks());
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);
        log.info("Booking created successfully: bookingNumber={}, bookingId={}, amount={}", 
                bookingNumber, booking.getBookingId(), booking.getTotalAmount());
        return mapToResponse(booking);
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    @Override
    public BookingResponse getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with number: " + bookingNumber));
        return mapToResponse(booking);
    }

    @Override
    public List<BookingResponse> getBookingsByCustomer(Long customerId) {
        List<Booking> bookings = bookingRepository.findByCustomerCustomerId(customerId);
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingsByDealership(Long dealershipId, BookingStatus status) {
        List<Booking> bookings;
        if (status != null) {
            bookings = bookingRepository.findByDealershipDealershipIdAndStatus(dealershipId, status);
        } else {
            bookings = bookingRepository.findByDealershipDealershipId(dealershipId);
        }
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public BookingResponse updateBookingStatus(Long id, BookingStatus status) {
        log.info("Updating booking status: bookingId={}, newStatus={}", id, status);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot update status of a cancelled booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED && status != BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot change status of a completed booking");
        }

        booking.setStatus(status);
        
        if (booking.getVehicle() != null) {
            if (status == BookingStatus.CONFIRMED) {
                booking.getVehicle().setStatus(VehicleStatus.BOOKED);
            } else if (status == BookingStatus.COMPLETED) {
                booking.getVehicle().setStatus(VehicleStatus.SOLD);
            }
            vehicleRepository.save(booking.getVehicle());
        }

        booking = bookingRepository.save(booking);
        log.info("Booking status updated successfully: bookingId={}, status={}", id, status);
        return mapToResponse(booking);
    }

    @Override
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public void cancelBooking(Long id, String reason) {
        log.info("Cancelling booking: bookingId={}", id);

        if (id == null) {
            throw new BadRequestException("Booking ID must not be null");
        }
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Cancellation reason is required");
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        // Null-safe refund calculation
        BigDecimal bookingAmount = booking.getBookingAmount();
        if (bookingAmount == null) {
            log.warn("Booking {} has null bookingAmount, defaulting to ZERO for refund calculation", id);
            bookingAmount = BigDecimal.ZERO;
        }
        BigDecimal cancellationCharges = bookingAmount.multiply(new BigDecimal("0.10"));
        BigDecimal refundAmount = bookingAmount.subtract(cancellationCharges);

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking {} status set to CANCELLED", id);

        // Create cancellation record
        BookingCancellation cancellation = new BookingCancellation();
        cancellation.setBooking(booking);
        cancellation.setCancellationDate(LocalDate.now());
        cancellation.setReason(reason.trim());
        cancellation.setRefundAmount(refundAmount);
        cancellation.setRefundStatus(com.dms.demo.enums.RefundStatus.PENDING);

        // Resolve current user safely (security is in debug/permitAll mode)
        try {
            org.springframework.security.core.Authentication auth =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                userRepository.findByUsername(auth.getName()).ifPresent(cancellation::setCancelledBy);
            }
        } catch (Exception e) {
            log.warn("Could not resolve current user for cancellation audit, proceeding without: {}", e.getMessage());
        }

        cancellationRepository.save(cancellation);

        // Release vehicle back to inventory if linked
        if (booking.getVehicle() != null) {
            try {
                booking.getVehicle().setStatus(com.dms.demo.enums.VehicleStatus.IN_SHOWROOM);
                vehicleRepository.save(booking.getVehicle());
                log.info("Vehicle {} released back to IN_SHOWROOM", booking.getVehicle().getVehicleId());
            } catch (Exception e) {
                log.error("Failed to release vehicle for booking {}: {}", id, e.getMessage());
                throw new RuntimeException("Cancellation failed: could not update vehicle status", e);
            }
        }

        log.info("Booking {} cancelled successfully, refundAmount={}", id, refundAmount);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setBookingNumber(booking.getBookingNumber());
        response.setCustomerName(booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName());
        response.setVehicleModel(booking.getVariant().getModel().getModelName());
        response.setVariantName(booking.getVariant().getVariantName());
        response.setDealershipName(booking.getDealership().getDealershipName());
        response.setSalesExecutiveName(booking.getSalesExecutive().getFullName());
        response.setBookingAmount(booking.getBookingAmount());
        response.setTotalAmount(booking.getTotalAmount());
        response.setBookingDate(booking.getBookingDate());
        response.setExpectedDeliveryDate(booking.getExpectedDeliveryDate());
        response.setStatus(booking.getStatus().name());
        response.setPaymentMode(booking.getPaymentMode());
        response.setRemarks(booking.getRemarks());
        return response;
    }

    @Override
    public Page<BookingResponse> findBookingsWithFilters(BookingFilterDTO filter, Pageable pageable) {
        log.debug("Finding bookings with filters: {}", filter);
        Specification<Booking> spec = BookingSpecification.withFilters(filter);
        Page<Booking> bookingPage = bookingRepository.findAll(spec, pageable);
        return bookingPage.map(this::mapToResponse);
    }

    @Override
    public List<BookingResponse> findBookingsWithFilters(BookingFilterDTO filter) {
        log.debug("Finding bookings with filters (no pagination): {}", filter);
        Specification<Booking> spec = BookingSpecification.withFilters(filter);
        List<Booking> bookings = bookingRepository.findAll(spec);
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
}
