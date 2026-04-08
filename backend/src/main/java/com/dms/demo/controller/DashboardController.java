package com.dms.demo.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.repository.DispatchRecordRepository;
import com.dms.demo.repository.SalesTransactionRepository;
import com.dms.demo.repository.TestDriveRepository;
import com.dms.demo.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final SalesTransactionRepository salesTransactionRepository;
    private final TestDriveRepository testDriveRepository;
    private final DispatchRecordRepository dispatchRecordRepository;

    @GetMapping("/kpi")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKPIData(
            @RequestParam(required = false) Long dealershipId) {

        Map<String, Object> kpiData = new HashMap<>();

        // Total vehicles in stock
        Long totalVehicles = dealershipId != null
            ? vehicleRepository.countByDealershipDealershipIdAndStatusIn(
                dealershipId,
                Arrays.asList(VehicleStatus.IN_SHOWROOM, VehicleStatus.IN_STOCKYARD))
            : vehicleRepository.countByStatusIn(
                Arrays.asList(VehicleStatus.IN_SHOWROOM, VehicleStatus.IN_STOCKYARD));

        kpiData.put("totalVehicles", totalVehicles);

        // Bookings today â€” use explicit @Query to avoid derived-method resolution issues
        LocalDate today = LocalDate.now();
        log.info("Dashboard KPI: querying bookings for date={}, dealershipId={}", today, dealershipId);

        Long bookingsToday = dealershipId != null
            ? bookingRepository.countByDealershipDealershipIdAndBookingDate(dealershipId, today)
            : bookingRepository.countByBookingDate(today);

        log.info("Dashboard KPI: bookingsToday={}", bookingsToday);
        kpiData.put("bookingsToday", bookingsToday != null ? bookingsToday : 0L);

        // Deliveries this month
        LocalDate startOfMonth = YearMonth.now().atDay(1);
        LocalDate endOfMonth = YearMonth.now().atEndOfMonth();
        log.info("Dashboard KPI: querying deliveries for {} to {}, dealershipId={}", startOfMonth, endOfMonth, dealershipId);

        Long deliveriesThisMonth = dealershipId != null
            ? dispatchRecordRepository.countByDealershipIdAndDispatchDateBetween(
                dealershipId, startOfMonth, endOfMonth)
            : dispatchRecordRepository.countByDispatchDateBetween(startOfMonth, endOfMonth);

        log.info("Dashboard KPI: deliveriesThisMonth={}", deliveriesThisMonth);
        kpiData.put("deliveriesThisMonth", deliveriesThisMonth != null ? deliveriesThisMonth : 0L);

        // Revenue this month
        log.info("Dashboard KPI: querying revenue for {} to {}, dealershipId={}", startOfMonth, endOfMonth, dealershipId);

        BigDecimal revenueThisMonth = dealershipId != null
            ? salesTransactionRepository.sumTotalAmountByDealershipAndDateRange(
                dealershipId, startOfMonth, endOfMonth)
            : salesTransactionRepository.sumTotalAmountByDateRange(startOfMonth, endOfMonth);

        log.info("Dashboard KPI: revenueThisMonth={}", revenueThisMonth);
        kpiData.put("revenueThisMonth", revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO);

        return ResponseEntity.ok(ApiResponse.success("KPI data retrieved successfully", kpiData));
    }

    @GetMapping("/monthly-sales")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthlySales(
            @RequestParam(required = false) Long dealershipId) {
        
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        LocalDate today = LocalDate.now();
        
        List<Object[]> results = dealershipId != null
            ? salesTransactionRepository.getMonthlySalesByDealership(dealershipId, sixMonthsAgo, today)
            : salesTransactionRepository.getMonthlySalesByDealership(null, sixMonthsAgo, today);
        
        List<Map<String, Object>> monthlySales = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", getMonthName((Integer) row[0], (Integer) row[1]));
            monthData.put("sales", row[3]); // totalRevenue
            monthData.put("count", row[2]); // totalSales
            monthlySales.add(monthData);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Monthly sales data retrieved successfully", monthlySales));
    }


    @GetMapping("/inventory-status")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getInventoryByStatus(
            @RequestParam(required = false) Long dealershipId) {
        
        List<Map<String, Object>> inventoryStatus = new ArrayList<>();
        
        for (VehicleStatus status : VehicleStatus.values()) {
            Long count = dealershipId != null
                ? vehicleRepository.countByStatusAndDealershipDealershipId(status, dealershipId)
                : vehicleRepository.countByStatus(status);
            
            if (count > 0) {
                Map<String, Object> statusData = new HashMap<>();
                statusData.put("name", formatStatusName(status.name()));
                statusData.put("value", count);
                inventoryStatus.add(statusData);
            }
        }
        
        return ResponseEntity.ok(ApiResponse.success("Inventory status retrieved successfully", inventoryStatus));
    }

    @GetMapping("/today-test-drives")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTodayTestDrives(
            @RequestParam(required = false) Long dealershipId) {
        
        LocalDate today = LocalDate.now();
        
        List<Object[]> results = dealershipId != null
            ? testDriveRepository.findTodayTestDrivesByDealership(dealershipId, today)
            : testDriveRepository.findTodayTestDrives(today);
        
        List<Map<String, Object>> testDrives = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> drive = new HashMap<>();
            drive.put("id", row[0]);
            drive.put("scheduledDateTime", row[1]);
            drive.put("customerName", row[2] + " " + row[3]);
            drive.put("vehicleModel", row[4] + " - " + row[5]);
            drive.put("status", row[6]);
            testDrives.add(drive);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Today's test drives retrieved successfully", testDrives));
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecentBookings(
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Object[]> results = dealershipId != null
            ? bookingRepository.findRecentBookingsByDealership(dealershipId, PageRequest.of(0, limit))
            : bookingRepository.findRecentBookings(PageRequest.of(0, limit));
        
        List<Map<String, Object>> bookings = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> booking = new HashMap<>();
            booking.put("id", row[0]);
            booking.put("bookingNumber", row[1]);
            booking.put("customerName", row[2] + " " + row[3]);
            booking.put("vehicleModel", row[4] + " - " + row[5]);
            booking.put("status", row[6]);
            bookings.add(booking);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Recent bookings retrieved successfully", bookings));
    }

    @GetMapping("/due-for-dispatch")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVehiclesDueForDispatch(
            @RequestParam(required = false) Long dealershipId) {
        
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        
        List<Object[]> results = dealershipId != null
            ? bookingRepository.findVehiclesDueForDispatchByDealership(dealershipId, today, nextWeek)
            : bookingRepository.findVehiclesDueForDispatch(today, nextWeek);
        
        List<Map<String, Object>> vehicles = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> vehicle = new HashMap<>();
            vehicle.put("id", row[0]);
            vehicle.put("vin", row[1]);
            vehicle.put("model", row[2]);
            vehicle.put("variant", row[3]);
            vehicle.put("expectedDeliveryDate", row[4]);
            vehicles.add(vehicle);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Vehicles due for dispatch retrieved successfully", vehicles));
    }

    // Helper methods
    private String getMonthName(Integer year, Integer month) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        return months[month - 1] + " " + year;
    }

    private String formatStatusName(String status) {
        return Arrays.stream(status.split("_"))
                .map(word -> word.charAt(0) + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
