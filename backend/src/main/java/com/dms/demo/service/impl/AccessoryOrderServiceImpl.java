package com.dms.demo.service.impl;

import com.dms.demo.dto.request.AccessoryOrderRequest;
import com.dms.demo.dto.response.AccessoryOrderResponse;
import com.dms.demo.entity.Accessory;
import com.dms.demo.entity.AccessoryOrder;
import com.dms.demo.entity.Booking;
import com.dms.demo.enums.AccessoryOrderStatus;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.AccessoryOrderRepository;
import com.dms.demo.repository.AccessoryRepository;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.service.AccessoryOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccessoryOrderServiceImpl implements AccessoryOrderService {

    private final AccessoryOrderRepository accessoryOrderRepository;
    private final BookingRepository bookingRepository;
    private final AccessoryRepository accessoryRepository;

    @Override
    @Transactional
    public AccessoryOrderResponse createOrder(AccessoryOrderRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        List<AccessoryOrder> orders = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (AccessoryOrderRequest.AccessoryOrderItem item : request.getAccessories()) {
            Accessory accessory = accessoryRepository.findById(item.getAccessoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Accessory not found"));

            AccessoryOrder order = new AccessoryOrder();
            order.setBooking(booking);
            order.setAccessory(accessory);
            order.setQuantity(item.getQuantity());
            order.setUnitPrice(accessory.getPrice());
            order.setTotalPrice(accessory.getPrice().multiply(new BigDecimal(item.getQuantity())));
            order.setInstallationRequired(request.getInstallationRequired() != null ? 
                    request.getInstallationRequired() : false);
            order.setInstallationDate(request.getInstallationDate());
            order.setStatus(AccessoryOrderStatus.ORDERED);

            orders.add(accessoryOrderRepository.save(order));
            totalAmount = totalAmount.add(order.getTotalPrice());
        }

        return mapToResponse(orders, totalAmount);
    }

    @Override
    public AccessoryOrderResponse getOrderById(Long id) {
        AccessoryOrder order = accessoryOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory order not found"));
        
        List<AccessoryOrder> orders = accessoryOrderRepository
                .findByBookingBookingId(order.getBooking().getBookingId());
        
        BigDecimal totalAmount = orders.stream()
                .map(AccessoryOrder::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return mapToResponse(orders, totalAmount);
    }

    @Override
    public List<AccessoryOrderResponse> getOrdersByBooking(Long bookingId) {
        List<AccessoryOrder> orders = accessoryOrderRepository.findByBookingBookingId(bookingId);
        
        if (orders.isEmpty()) {
            return new ArrayList<>();
        }
        
        BigDecimal totalAmount = orders.stream()
                .map(AccessoryOrder::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return List.of(mapToResponse(orders, totalAmount));
    }

    @Override
    @Transactional
    public AccessoryOrderResponse updateOrderStatus(Long id, AccessoryOrderStatus status) {
        AccessoryOrder order = accessoryOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory order not found"));
        
        order.setStatus(status);
        accessoryOrderRepository.save(order);
        
        List<AccessoryOrder> orders = accessoryOrderRepository
                .findByBookingBookingId(order.getBooking().getBookingId());
        
        BigDecimal totalAmount = orders.stream()
                .map(AccessoryOrder::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return mapToResponse(orders, totalAmount);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        accessoryOrderRepository.deleteById(id);
    }

    private AccessoryOrderResponse mapToResponse(List<AccessoryOrder> orders, BigDecimal totalAmount) {
        if (orders.isEmpty()) {
            return null;
        }

        AccessoryOrder firstOrder = orders.get(0);
        AccessoryOrderResponse response = new AccessoryOrderResponse();
        response.setOrderId(firstOrder.getOrderId());
        response.setBookingId(firstOrder.getBooking().getBookingId());
        response.setBookingNumber(firstOrder.getBooking().getBookingNumber());
        response.setCustomerName(firstOrder.getBooking().getCustomer().getFirstName() + " " +
                firstOrder.getBooking().getCustomer().getLastName());
        response.setTotalAmount(totalAmount);
        response.setInstallationRequired(firstOrder.getInstallationRequired());
        response.setInstallationDate(firstOrder.getInstallationDate());
        response.setStatus(firstOrder.getStatus().name());

        List<AccessoryOrderResponse.AccessoryOrderItemResponse> items = orders.stream()
                .map(order -> {
                    AccessoryOrderResponse.AccessoryOrderItemResponse item = 
                            new AccessoryOrderResponse.AccessoryOrderItemResponse();
                    item.setAccessoryId(order.getAccessory().getAccessoryId());
                    item.setAccessoryName(order.getAccessory().getAccessoryName());
                    item.setQuantity(order.getQuantity());
                    item.setUnitPrice(order.getUnitPrice());
                    item.setTotalPrice(order.getTotalPrice());
                    return item;
                })
                .collect(Collectors.toList());

        response.setAccessories(items);
        return response;
    }
}
