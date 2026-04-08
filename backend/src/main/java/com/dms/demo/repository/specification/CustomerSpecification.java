package com.dms.demo.repository.specification;

import com.dms.demo.dto.filter.CustomerFilterDTO;
import com.dms.demo.entity.Customer;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class CustomerSpecification {

    public static Specification<Customer> withFilters(CustomerFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            log.info("=== CUSTOMER FILTER DEBUG ===");
            log.info("Filter DTO: {}", filter);
            
            List<Predicate> predicates = new ArrayList<>();

            // Search filter (name, email, phone)
            if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
                String searchPattern = "%" + filter.getSearch().toLowerCase() + "%";
                log.info("Adding search filter: LIKE {}", searchPattern);
                
                Predicate firstNamePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("firstName")), 
                    searchPattern
                );
                Predicate lastNamePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("lastName")), 
                    searchPattern
                );
                Predicate emailPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")), 
                    searchPattern
                );
                Predicate phonePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("phone")), 
                    searchPattern
                );
                
                predicates.add(criteriaBuilder.or(
                    firstNamePredicate, 
                    lastNamePredicate, 
                    emailPredicate, 
                    phonePredicate
                ));
            }

            // Customer type filter
            if (filter.getCustomerType() != null) {
                log.info("Adding customer type filter: {}", filter.getCustomerType());
                predicates.add(criteriaBuilder.equal(
                    root.get("customerType"), 
                    filter.getCustomerType()
                ));
            }

            // City filter
            if (filter.getCity() != null && !filter.getCity().trim().isEmpty()) {
                log.info("Adding city filter: {}", filter.getCity());
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("city")), 
                    "%" + filter.getCity().toLowerCase() + "%"
                ));
            }

            // State filter
            if (filter.getState() != null && !filter.getState().trim().isEmpty()) {
                log.info("Adding state filter: {}", filter.getState());
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("state")), 
                    "%" + filter.getState().toLowerCase() + "%"
                ));
            }

            // Date of birth range filter
            if (filter.getDobFrom() != null) {
                log.info("Adding DOB from filter: >= {}", filter.getDobFrom());
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("dateOfBirth"), 
                    filter.getDobFrom()
                ));
            }

            if (filter.getDobTo() != null) {
                log.info("Adding DOB to filter: <= {}", filter.getDobTo());
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("dateOfBirth"), 
                    filter.getDobTo()
                ));
            }

            // Loyalty points range filter
            if (filter.getLoyaltyPointsFrom() != null) {
                log.info("Adding loyalty points from filter: >= {}", filter.getLoyaltyPointsFrom());
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("loyaltyPoints"), 
                    filter.getLoyaltyPointsFrom()
                ));
            }

            if (filter.getLoyaltyPointsTo() != null) {
                log.info("Adding loyalty points to filter: <= {}", filter.getLoyaltyPointsTo());
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("loyaltyPoints"), 
                    filter.getLoyaltyPointsTo()
                ));
            }

            // Active status filter
            if (filter.getIsActive() != null) {
                log.info("Adding active status filter: {}", filter.getIsActive());
                predicates.add(criteriaBuilder.equal(
                    root.get("isActive"), 
                    filter.getIsActive()
                ));
            }

            log.info("Total predicates added: {}", predicates.size());
            Predicate finalPredicate = criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            log.info("=== END CUSTOMER FILTER DEBUG ===");
            return finalPredicate;
        };
    }
}
