package com.dms.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.SalesTransaction;

public interface SalesTransactionRepository extends JpaRepository<SalesTransaction, Long> {
    List<SalesTransaction> findByDealershipDealershipId(Long dealershipId);
    List<SalesTransaction> findBySaleDateBetween(LocalDate from, LocalDate to);
    List<SalesTransaction> findBySalesExecutiveUserId(Long userId);

    // Pageable variants
    Page<SalesTransaction> findAll(Pageable pageable);
    Page<SalesTransaction> findByDealershipDealershipId(Long dealershipId, Pageable pageable);
    Page<SalesTransaction> findBySaleDateBetween(LocalDate from, LocalDate to, Pageable pageable);
    
    @Query("SELECT FUNCTION('YEAR', st.saleDate) as year, FUNCTION('MONTH', st.saleDate) as month, " +
           "COUNT(st) as count, SUM(st.totalAmount) as revenue " +
           "FROM SalesTransaction st " +
           "WHERE (:dealershipId IS NULL OR st.dealership.dealershipId = :dealershipId) " +
           "AND st.saleDate BETWEEN :from AND :to " +
           "GROUP BY FUNCTION('YEAR', st.saleDate), FUNCTION('MONTH', st.saleDate) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlySalesByDealership(@Param("dealershipId") Long dealershipId, 
                                                @Param("from") LocalDate from, 
                                                @Param("to") LocalDate to);
    
    @Query("SELECT vm.modelName as modelName, vv.variantName as variantName, " +
           "COUNT(st) as salesCount, SUM(st.totalAmount) as totalRevenue " +
           "FROM SalesTransaction st " +
           "JOIN st.vehicle v " +
           "JOIN v.variant vv " +
           "JOIN vv.model vm " +
           "WHERE st.saleDate BETWEEN :from AND :to " +
           "GROUP BY vm.modelName, vv.variantName " +
           "ORDER BY salesCount DESC")
    List<Object[]> getTopSellingModels(@Param("from") LocalDate from, @Param("to") LocalDate to);
    
    @Query("SELECT vv.variantName as variantName, COUNT(st) as count, " +
           "SUM(st.totalAmount) as revenue, AVG(st.totalAmount) as avgPrice " +
           "FROM SalesTransaction st " +
           "JOIN st.vehicle v " +
           "JOIN v.variant vv " +
           "WHERE st.saleDate BETWEEN :from AND :to " +
           "GROUP BY vv.variantName " +
           "ORDER BY revenue DESC")
    List<Object[]> getRevenueByVariant(@Param("from") LocalDate from, @Param("to") LocalDate to);
    
    @Query("SELECT COALESCE(SUM(st.totalAmount), 0) FROM SalesTransaction st " +
           "WHERE st.dealership.dealershipId = :dealershipId " +
           "AND st.saleDate BETWEEN :from AND :to")
    java.math.BigDecimal sumTotalAmountByDealershipAndDateRange(
            @Param("dealershipId") Long dealershipId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
    
    @Query("SELECT COALESCE(SUM(st.totalAmount), 0) FROM SalesTransaction st " +
           "WHERE st.saleDate BETWEEN :from AND :to")
    java.math.BigDecimal sumTotalAmountByDateRange(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}
