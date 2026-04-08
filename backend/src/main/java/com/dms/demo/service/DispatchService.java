package com.dms.demo.service;

import com.dms.demo.dto.request.DispatchRequest;
import com.dms.demo.dto.response.DispatchResponse;

public interface DispatchService {
    DispatchResponse dispatchVehicle(DispatchRequest request);
    DispatchResponse getDispatchByBooking(Long bookingId);
    DispatchResponse getDispatchById(Long id);
}
