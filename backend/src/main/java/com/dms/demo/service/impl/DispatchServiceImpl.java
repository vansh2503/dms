package com.dms.demo.service.impl;

import com.dms.demo.dto.request.DispatchRequest;
import com.dms.demo.dto.response.DispatchResponse;
import com.dms.demo.entity.*;
import com.dms.demo.enums.BookingStatus;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.*;
import com.dms.demo.service.DispatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DispatchServiceImpl implements DispatchService {

    private final DispatchRecordRepository dispatchRecordRepository;
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DispatchResponse dispatchVehicle(DispatchRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot dispatch for booking with status: " + booking.getStatus());
        }

        if (dispatchRecordRepository.findByBookingBookingId(request.getBookingId()).isPresent()) {
            throw new BadRequestException("Vehicle already dispatched for this booking");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        User dispatchedBy = userRepository.findById(request.getDispatchedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DispatchRecord record = new DispatchRecord();
        record.setBooking(booking);
        record.setVehicle(vehicle);
        record.setCustomer(customer);
        record.setDispatchedBy(dispatchedBy);
        record.setDispatchDate(request.getDispatchDate());
        record.setDispatchTime(request.getDispatchTime());
        record.setDeliveryLocation(request.getDeliveryLocation());
        record.setOdometerReading(request.getOdometerReading());
        record.setFuelLevel(request.getFuelLevel());
        record.setDocumentsHandedOver(request.getDocumentsHandedOver() != null ? request.getDocumentsHandedOver() : false);
        record.setKeysHandedOver(request.getKeysHandedOver() != null ? request.getKeysHandedOver() : false);
        record.setCustomerSignature(request.getCustomerSignature() != null ? request.getCustomerSignature() : false);
        record.setRemarks(request.getRemarks());

        // Update booking and vehicle status
        booking.setStatus(BookingStatus.COMPLETED);
        vehicle.setStatus(VehicleStatus.SOLD);
        bookingRepository.save(booking);
        vehicleRepository.save(vehicle);

        return mapToResponse(dispatchRecordRepository.save(record));
    }

    @Override
    public DispatchResponse getDispatchByBooking(Long bookingId) {
        DispatchRecord record = dispatchRecordRepository.findByBookingBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch record not found for booking: " + bookingId));
        return mapToResponse(record);
    }

    @Override
    public DispatchResponse getDispatchById(Long id) {
        DispatchRecord record = dispatchRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch record not found with id: " + id));
        return mapToResponse(record);
    }

    private DispatchResponse mapToResponse(DispatchRecord record) {
        DispatchResponse response = new DispatchResponse();
        response.setDispatchId(record.getDispatchId());
        response.setBookingId(record.getBooking().getBookingId());
        response.setVehicleVin(record.getVehicle().getVin());
        response.setCustomerName(record.getCustomer().getFirstName() + " " + record.getCustomer().getLastName());
        response.setDispatchDate(record.getDispatchDate());
        response.setDispatchTime(record.getDispatchTime());
        response.setDeliveryLocation(record.getDeliveryLocation());
        response.setDocumentsHandedOver(record.getDocumentsHandedOver());
        response.setKeysHandedOver(record.getKeysHandedOver());
        response.setCustomerSignature(record.getCustomerSignature());
        return response;
    }
}
