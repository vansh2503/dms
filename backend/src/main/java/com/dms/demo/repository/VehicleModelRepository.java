package com.dms.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dms.demo.entity.VehicleModel;

public interface VehicleModelRepository extends JpaRepository<VehicleModel, Long> {
    List<VehicleModel> findByIsActiveTrue();
}
