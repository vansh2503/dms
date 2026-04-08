package com.dms.demo.repository.specification;

import com.dms.demo.dto.filter.VehicleFilterDTO;
import com.dms.demo.entity.Vehicle;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class VehicleSpecification {

    public static Specification<Vehicle> withFilters(VehicleFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            log.info("=== VEHICLE FILTER DEBUG ===");
            log.info("Filter DTO: {}", filter);
            log.info("Model: {}", filter.getModel());
            log.info("FuelType: {}", filter.getFuelType());
            log.info("TransmissionType: {}", filter.getTransmissionType());
            log.info("FromDate: {}", filter.getFromDate());
            log.info("ToDate: {}", filter.getToDate());
            
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getDealershipId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("dealership").get("dealershipId"), 
                    filter.getDealershipId()
                ));
            }

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("status"), 
                    filter.getStatus()
                ));
            }

            if (filter.getColor() != null && !filter.getColor().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("color")), 
                    filter.getColor().toLowerCase()
                ));
            }

            if (filter.getManufacturingYear() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("manufacturingYear"), 
                    filter.getManufacturingYear()
                ));
            }

            if (filter.getManufacturingYearFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("manufacturingYear"), 
                    filter.getManufacturingYearFrom()
                ));
            }

            if (filter.getManufacturingYearTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("manufacturingYear"), 
                    filter.getManufacturingYearTo()
                ));
            }

            if (filter.getPriceFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("sellingPrice"), 
                    filter.getPriceFrom()
                ));
            }

            if (filter.getPriceTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("sellingPrice"), 
                    filter.getPriceTo()
                ));
            }

            if (filter.getVariantId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("variant").get("variantId"), 
                    filter.getVariantId()
                ));
            }

            if (filter.getModelId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("variant").get("model").get("modelId"), 
                    filter.getModelId()
                ));
            }
            
            // NEW: Filter by model name (case-insensitive)
            if (filter.getModel() != null && !filter.getModel().trim().isEmpty()) {
                String modelPattern = "%" + filter.getModel().toLowerCase() + "%";
                log.info("Adding model filter: LIKE {}", modelPattern);
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("variant").get("model").get("modelName")), 
                    modelPattern
                ));
            }
            
            // NEW: Filter by fuel type
            if (filter.getFuelType() != null) {
                log.info("Adding fuel type filter: {}", filter.getFuelType());
                predicates.add(criteriaBuilder.equal(
                    root.get("variant").get("fuelType"), 
                    filter.getFuelType()
                ));
            }
            
            // NEW: Filter by transmission type
            if (filter.getTransmissionType() != null) {
                log.info("Adding transmission type filter: {}", filter.getTransmissionType());
                predicates.add(criteriaBuilder.equal(
                    root.get("variant").get("transmission"), 
                    filter.getTransmissionType()
                ));
            }
            
            // NEW: Filter by arrival date range
            if (filter.getFromDate() != null) {
                log.info("Adding fromDate filter: >= {}", filter.getFromDate());
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("arrivalDate"), 
                    filter.getFromDate()
                ));
            }
            
            if (filter.getToDate() != null) {
                log.info("Adding toDate filter: <= {}", filter.getToDate());
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("arrivalDate"), 
                    filter.getToDate()
                ));
            }

            if (filter.getStockyardId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("stockyard").get("stockyardId"), 
                    filter.getStockyardId()
                ));
            }

            if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
                String searchPattern = "%" + filter.getSearch().toLowerCase() + "%";
                Predicate vinPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("vin")), 
                    searchPattern
                );
                Predicate chassisPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("chassisNumber")), 
                    searchPattern
                );
                Predicate enginePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("engineNumber")), 
                    searchPattern
                );
                predicates.add(criteriaBuilder.or(
                    vinPredicate, 
                    chassisPredicate, 
                    enginePredicate
                ));
            }

            log.info("Total predicates added: {}", predicates.size());
            Predicate finalPredicate = criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            log.info("=== END VEHICLE FILTER DEBUG ===");
            return finalPredicate;
        };
    }
}
