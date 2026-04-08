package com.dms.demo.repository;

import com.dms.demo.entity.Dealership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DealershipRepository extends JpaRepository<Dealership, Long> {
    List<Dealership> findByIsActiveTrue();
    boolean existsByDealershipCode(String dealershipCode);
}
