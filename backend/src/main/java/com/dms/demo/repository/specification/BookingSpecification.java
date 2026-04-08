package com.dms.demo.repository.specification;

import com.dms.demo.dto.filter.BookingFilterDTO;
import com.dms.demo.entity.Booking;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class BookingSpecification {

    public static Specification<Booking> withFilters(BookingFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getDealershipId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("dealership").get("dealershipId"), 
                    filter.getDealershipId()
                ));
            }

            if (filter.getCustomerId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("customer").get("customerId"), 
                    filter.getCustomerId()
                ));
            }

            if (filter.getSalesExecutiveId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("salesExecutive").get("userId"), 
                    filter.getSalesExecutiveId()
                ));
            }

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("status"), 
                    filter.getStatus()
                ));
            }

            if (filter.getBookingDateFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("bookingDate"), 
                    filter.getBookingDateFrom()
                ));
            }

            if (filter.getBookingDateTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("bookingDate"), 
                    filter.getBookingDateTo()
                ));
            }

            if (filter.getExpectedDeliveryFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("expectedDeliveryDate"), 
                    filter.getExpectedDeliveryFrom()
                ));
            }

            if (filter.getExpectedDeliveryTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("expectedDeliveryDate"), 
                    filter.getExpectedDeliveryTo()
                ));
            }

            if (filter.getAmountFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("totalAmount"), 
                    filter.getAmountFrom()
                ));
            }

            if (filter.getAmountTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("totalAmount"), 
                    filter.getAmountTo()
                ));
            }

            if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
                String searchPattern = "%" + filter.getSearch().toLowerCase() + "%";
                Predicate bookingNumberPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("bookingNumber")), 
                    searchPattern
                );
                Predicate customerFirstNamePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("customer").get("firstName")), 
                    searchPattern
                );
                Predicate customerLastNamePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("customer").get("lastName")), 
                    searchPattern
                );
                predicates.add(criteriaBuilder.or(
                    bookingNumberPredicate, 
                    customerFirstNamePredicate, 
                    customerLastNamePredicate
                ));
            }

            // Payment mode filter
            if (filter.getPaymentMode() != null && !filter.getPaymentMode().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                    root.get("paymentMode"), 
                    filter.getPaymentMode()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
