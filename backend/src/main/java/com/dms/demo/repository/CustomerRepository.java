package com.dms.demo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dms.demo.entity.Customer;
import com.dms.demo.enums.CustomerType;

public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String first, String last);

    @Query("SELECT c FROM Customer c WHERE c.isActive = true AND (" +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Customer> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT c FROM Customer c WHERE c.isActive = true AND (" +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Customer> searchByKeywordPageable(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.isActive = true " +
           "AND (:search IS NULL OR :search = '' OR " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "c.phone LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:city IS NULL OR LOWER(c.city) = LOWER(:city)) " +
           "AND (:customerType IS NULL OR c.customerType = :customerType) " +
           "AND (:fromDate IS NULL OR CAST(c.createdAt AS date) >= :fromDate) " +
           "AND (:toDate IS NULL OR CAST(c.createdAt AS date) <= :toDate)")
    List<Customer> findWithFilters(
        @Param("search") String search,
        @Param("city") String city,
        @Param("customerType") CustomerType customerType,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );

    List<Customer> findAllByIsActiveTrue();
    Page<Customer> findAllByIsActiveTrue(Pageable pageable);

    boolean existsByPhoneAndIsActiveTrue(String phone);
    boolean existsByEmailAndIsActiveTrue(String email);
}
