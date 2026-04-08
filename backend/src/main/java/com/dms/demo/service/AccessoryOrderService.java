package com.dms.demo.service;

import com.dms.demo.dto.request.AccessoryOrderRequest;
import com.dms.demo.dto.response.AccessoryOrderResponse;
import com.dms.demo.enums.AccessoryOrderStatus;

import java.util.List;

public interface AccessoryOrderService {
    AccessoryOrderResponse createOrder(AccessoryOrderRequest request);
    AccessoryOrderResponse getOrderById(Long id);
    List<AccessoryOrderResponse> getOrdersByBooking(Long bookingId);
    AccessoryOrderResponse updateOrderStatus(Long id, AccessoryOrderStatus status);
    void deleteOrder(Long id);
}
