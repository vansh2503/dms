package com.dms.demo.util;

import com.dms.demo.dto.response.VehicleResponse;
import com.dms.demo.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public static VehicleResponse toResponse(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }

        VehicleResponse response = new VehicleResponse();
        response.setId(vehicle.getVehicleId());
        response.setVin(vehicle.getVin());
        response.setChassisNumber(vehicle.getChassisNumber());
        response.setEngineNumber(vehicle.getEngineNumber());
        response.setColor(vehicle.getColor());
        response.setManufacturingYear(vehicle.getManufacturingYear());
        response.setManufacturingMonth(vehicle.getManufacturingMonth());
        response.setStatus(vehicle.getStatus().name());
        response.setPrice(vehicle.getSellingPrice());
        response.setPurchasePrice(vehicle.getPurchasePrice());
        response.setArrivalDate(vehicle.getArrivalDate());

        if (vehicle.getVariant() != null) {
            response.setVariantId(vehicle.getVariant().getVariantId());
            response.setVariant(vehicle.getVariant().getVariantName());
            if (vehicle.getVariant().getFuelType() != null) {
                response.setFuelType(vehicle.getVariant().getFuelType().name());
            }
            if (vehicle.getVariant().getTransmission() != null) {
                response.setTransmissionType(vehicle.getVariant().getTransmission().name());
            }
            if (vehicle.getVariant().getModel() != null) {
                response.setModel(vehicle.getVariant().getModel().getModelName());
            }
        }

        if (vehicle.getDealership() != null) {
            response.setDealershipName(vehicle.getDealership().getDealershipName());
        }

        if (vehicle.getStockyard() != null) {
            response.setStockyardId(vehicle.getStockyard().getStockyardId());
            response.setStockyardLocation(vehicle.getStockyard().getStockyardName());
        }

        return response;
    }
}
