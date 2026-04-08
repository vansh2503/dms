package com.dms.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.VehicleVariant;
import com.dms.demo.enums.FuelType;
import com.dms.demo.enums.TransmissionType;

public interface VehicleVariantRepository extends JpaRepository<VehicleVariant, Long> {
    List<VehicleVariant> findByModelModelId(Long modelId);
    List<VehicleVariant> findByIsActiveTrue();
    
    @Query("SELECT v FROM VehicleVariant v JOIN v.model m WHERE v.isActive = true " +
           "AND (:search IS NULL OR LOWER(v.variantName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.variantCode) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:modelId IS NULL OR m.modelId = :modelId) " +
           "AND (:fuelType IS NULL OR v.fuelType = :fuelType) " +
           "AND (:transmission IS NULL OR v.transmission = :transmission)")
    List<VehicleVariant> findWithFilters(
        @Param("search") String search,
        @Param("modelId") Long modelId,
        @Param("fuelType") FuelType fuelType,
        @Param("transmission") TransmissionType transmission
    );
}
