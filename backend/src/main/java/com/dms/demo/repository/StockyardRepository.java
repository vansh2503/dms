package com.dms.demo.repository;

import com.dms.demo.entity.Stockyard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockyardRepository extends JpaRepository<Stockyard, Long> {
    List<Stockyard> findByDealershipDealershipId(Long dealershipId);
    List<Stockyard> findByIsActiveTrue();
    List<Stockyard> findByDealershipDealershipIdAndIsActiveTrue(Long dealershipId);
}
