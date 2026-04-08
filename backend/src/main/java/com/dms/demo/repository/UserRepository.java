package com.dms.demo.repository;

import com.dms.demo.entity.User;
import com.dms.demo.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Dynamic dropdown queries
    List<User> findByDealershipDealershipIdAndIsActiveTrue(Long dealershipId);
    List<User> findByRoleAndIsActiveTrue(UserRole role);
    List<User> findByDealershipDealershipIdAndRoleAndIsActiveTrue(Long dealershipId, UserRole role);
    List<User> findByIsActiveTrue();
}
