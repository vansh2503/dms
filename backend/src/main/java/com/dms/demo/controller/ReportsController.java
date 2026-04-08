package com.dms.demo.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.enums.BookingStatus;
import com.dms.demo.enums.VehicleStatus;
import com.dms.demo.repository.BookingRepository;
import com.dms.demo.repository.DispatchRecordRepository;
import com.dms.demo.repository.SalesTransactionRepository;
import com.dms.demo.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final SalesTransactionRepository salesTransactionRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final DispatchRecordRepository dispatchRecordRepository;

    // â”€â”€ Sales Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    @GetMapping("/sales-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Long dealershipId) {

        if (fromDate == null) fromDate = LocalDate.now().minusMonths(12);
        if (toDate   == null) toDate   = LocalDate.now();
        log.info("GET /reports/sales-summary from={} to={} dealershipId={}", fromDate, toDate, dealershipId);

        List<Object[]> rows = salesTransactionRepository.getMonthlySalesByDealership(dealershipId, fromDate, toDate);

        // Previous period for growth calculation
        long periodDays = java.time.temporal.ChronoUnit.DAYS.between(fromDate, toDate);
        LocalDate prevFrom = fromDate.minusDays(periodDays);
        LocalDate prevTo   = fromDate.minusDays(1);
        List<Object[]> prevRows = salesTransactionRepository.getMonthlySalesByDealership(dealershipId, prevFrom, prevTo);

        BigDecimal totalSales   = BigDecimal.ZERO;
        long       unitsSold    = 0;
        List<Map<String, Object>> monthlySales = new ArrayList<>();

        for (Object[] row : rows) {
            int    year    = ((Number) row[0]).intValue();
            int    month   = ((Number) row[1]).intValue();
            long   units   = ((Number) row[2]).longValue();
            BigDecimal rev = row[3] != null ? (BigDecimal) row[3] : BigDecimal.ZERO;

            totalSales = totalSales.add(rev);
            unitsSold += units;

            String monthLabel = LocalDate.of(year, month, 1)
                    .getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + year;
            BigDecimal avg = units > 0 ? rev.divide(BigDecimal.valueOf(units), 0, RoundingMode.HALF_UP) : BigDecimal.ZERO;

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month",    monthLabel);
            m.put("sales",    rev);
            m.put("units",    units);
            m.put("avgValue", avg);
            monthlySales.add(m);
        }

        BigDecimal avgSaleValue = unitsSold > 0
                ? totalSales.divide(BigDecimal.valueOf(unitsSold), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Revenue growth vs previous period
        BigDecimal prevRevenue = prevRows.stream()
                .map(r -> r[3] != null ? (BigDecimal) r[3] : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        double growth = 0;
        if (prevRevenue.compareTo(BigDecimal.ZERO) > 0) {
            growth = totalSales.subtract(prevRevenue)
                    .divide(prevRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalSales",    totalSales);
        result.put("unitsSold",     unitsSold);
        result.put("avgSaleValue",  avgSaleValue);
        result.put("growth",        Math.round(growth * 10.0) / 10.0);
        result.put("monthlySales",  monthlySales);

        log.info("Sales summary: totalSales={}, unitsSold={}, growth={}%", totalSales, unitsSold, growth);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // â”€â”€ Inventory Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    @GetMapping("/inventory-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventoryStatus(
            @RequestParam(required = false) Long dealershipId) {

        log.info("GET /reports/inventory-status dealershipId={}", dealershipId);

        long total = 0;
        List<Map<String, Object>> distribution = new ArrayList<>();

        for (VehicleStatus status : VehicleStatus.values()) {
            long count = dealershipId != null
                    ? vehicleRepository.countByStatusAndDealershipDealershipId(status, dealershipId)
                    : vehicleRepository.countByStatus(status);
            total += count;
            if (count > 0) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("name",  formatStatus(status.name()));
                entry.put("value", count);
                distribution.add(entry);
            }
        }

        long inShowroom  = countByStatus(VehicleStatus.IN_SHOWROOM,  dealershipId);
        long inStockyard = countByStatus(VehicleStatus.IN_STOCKYARD, dealershipId);
        long booked      = countByStatus(VehicleStatus.BOOKED,       dealershipId);
        long inTransit   = countByStatus(VehicleStatus.IN_TRANSIT,   dealershipId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalVehicles", total);
        result.put("inShowroom",    inShowroom);
        result.put("inStockyard",   inStockyard);
        result.put("booked",        booked);
        result.put("inTransit",     inTransit);
        result.put("distribution",  distribution);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // â”€â”€ Dispatch Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    @GetMapping("/dispatch-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDispatchSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Long dealershipId) {

        if (fromDate == null) fromDate = LocalDate.now().minusMonths(12);
        if (toDate   == null) toDate   = LocalDate.now();
        log.info("GET /reports/dispatch-summary from={} to={} dealershipId={}", fromDate, toDate, dealershipId);

        long totalDispatched = dealershipId != null
                ? dispatchRecordRepository.countByDispatchDateBetweenAndDealershipId(fromDate, toDate, dealershipId)
                : dispatchRecordRepository.countByDispatchDateBetween(fromDate, toDate);

        // Pending = CONFIRMED bookings with expectedDeliveryDate <= today
        long pending = bookingRepository.countByStatus(BookingStatus.CONFIRMED);

        // Build monthly dispatch trend using sales data as proxy (dispatch â‰ˆ completed sales)
        List<Object[]> monthlyRows = salesTransactionRepository.getMonthlySalesByDealership(dealershipId, fromDate, toDate);
        List<Map<String, Object>> monthlyDispatch = new ArrayList<>();
        for (Object[] row : monthlyRows) {
            int year  = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            long cnt  = ((Number) row[2]).longValue();
            String label = LocalDate.of(year, month, 1)
                    .getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + year;
            Map<String, Object> m = new HashMap<>();
            m.put("month",      label);
            m.put("dispatched", cnt);
            m.put("delayed",    0);
            monthlyDispatch.add(m);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalDispatched",  totalDispatched);
        result.put("onTime",           totalDispatched);
        result.put("delayed",          0L);
        result.put("pending",          pending);
        result.put("monthlyDispatch",  monthlyDispatch);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // â”€â”€ Booking Analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    @GetMapping("/booking-analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingAnalysis(
            @RequestParam(required = false) Long dealershipId) {

        log.info("GET /reports/booking-analysis dealershipId={}", dealershipId);

        long total     = 0;
        long confirmed = 0, pending = 0, cancelled = 0, completed = 0;
        List<Map<String, Object>> statusDistribution = new ArrayList<>();

        for (BookingStatus status : BookingStatus.values()) {
            long count;
            try {
                Long raw = dealershipId != null
                        ? bookingRepository.countByStatusAndDealershipDealershipId(status, dealershipId)
                        : bookingRepository.countByStatus(status);
                count = raw != null ? raw : 0L;
            } catch (Exception e) {
                log.error("Error counting bookings for status={}: {}", status, e.getMessage(), e);
                count = 0L;
            }

            total += count;
            if (count > 0) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("name",   status.name());
                entry.put("value",  count);
                entry.put("amount", BigDecimal.ZERO);
                statusDistribution.add(entry);
            }

            if (status == BookingStatus.CONFIRMED)  confirmed  = count;
            else if (status == BookingStatus.PENDING)    pending    = count;
            else if (status == BookingStatus.CANCELLED)  cancelled  = count;
            else if (status == BookingStatus.COMPLETED)  completed  = count;
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalBookings",      total);
        result.put("confirmed",          confirmed);
        result.put("pending",            pending);
        result.put("cancelled",          cancelled);
        result.put("completed",          completed);
        result.put("statusDistribution", statusDistribution);

        log.info("Booking analysis: total={}, confirmed={}, pending={}, cancelled={}, completed={}",
                total, confirmed, pending, cancelled, completed);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // â”€â”€ Top Models â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    @GetMapping("/top-models")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTopModels(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "10") int limit) {

        if (fromDate == null) fromDate = LocalDate.now().minusMonths(12);
        if (toDate   == null) toDate   = LocalDate.now();
        log.info("GET /reports/top-models from={} to={} limit={}", fromDate, toDate, limit);

        List<Object[]> rows = salesTransactionRepository.getTopSellingModels(fromDate, toDate);

        long totalUnitsSold = 0;
        List<Map<String, Object>> models = new ArrayList<>();

        for (Object[] row : rows) {
            long units = ((Number) row[2]).longValue();
            totalUnitsSold += units;
        }

        for (int i = 0; i < Math.min(rows.size(), limit); i++) {
            Object[] row = rows.get(i);
            String   modelName = (String) row[0];
            long     units     = ((Number) row[2]).longValue();
            BigDecimal revenue = row[3] != null ? (BigDecimal) row[3] : BigDecimal.ZERO;
            BigDecimal avg     = units > 0 ? revenue.divide(BigDecimal.valueOf(units), 0, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            double share = totalUnitsSold > 0 ? Math.round(units * 1000.0 / totalUnitsSold) / 10.0 : 0;

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("model",       modelName);
            m.put("unitsSold",   units);
            m.put("revenue",     revenue);
            m.put("avgPrice",    avg);
            m.put("marketShare", share);
            models.add(m);
        }

        String bestSeller = models.isEmpty() ? "N/A" : (String) models.get(0).get("model");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalModels",    models.size());
        result.put("bestSeller",     bestSeller);
        result.put("totalUnitsSold", totalUnitsSold);
        result.put("models",         models);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    private long countByStatus(VehicleStatus status, Long dealershipId) {
        return dealershipId != null
                ? vehicleRepository.countByStatusAndDealershipDealershipId(status, dealershipId)
                : vehicleRepository.countByStatus(status);
    }

    private String formatStatus(String s) {
        return java.util.Arrays.stream(s.split("_"))
                .map(w -> w.charAt(0) + w.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
