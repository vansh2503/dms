package com.dms.demo.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.Accessory;

public interface AccessoryRepository extends JpaRepository<Accessory, Long> {
    List<Accessory> findByIsActiveTrue();
    List<Accessory> findByCategoryIgnoreCase(String category);
    Optional<Accessory> findByAccessoryCode(String accessoryCode);
    
    @Query("SELECT a FROM Accessory a WHERE a.isActive = true " +
           "AND (:search IS NULL OR LOWER(a.accessoryName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.category) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:category IS NULL OR LOWER(a.category) = LOWER(:category)) " +
           "AND (:minPrice IS NULL OR a.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR a.price <= :maxPrice)")
    List<Accessory> findWithFilters(
        @Param("search") String search,
        @Param("category") String category,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );
}
