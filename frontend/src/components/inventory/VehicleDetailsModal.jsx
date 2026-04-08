import { Car, FileText, DollarSign, Calendar, StickyNote } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import DetailRow from '../ui/DetailRow';
import DetailSection from '../ui/DetailSection';

const VehicleDetailsModal = ({ vehicle }) => {
  if (!vehicle) return null;

  const formatCurrency = (amount) => amount != null ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN') : '—';
  const formatDateTime = (date) => date ? new Date(date).toLocaleString('en-IN') : '—';

  return (
    <div>
      {/* Header with Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{vehicle.model}</h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>{vehicle.variant}</p>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>

      {/* Vehicle Identification */}
      <DetailSection icon={Car} title="Vehicle Identification">
        <DetailRow label="VIN" value={vehicle.vin} />
        <DetailRow label="Chassis Number" value={vehicle.chassisNumber} />
        <DetailRow label="Engine Number" value={vehicle.engineNumber} />
      </DetailSection>

      {/* Specifications */}
      <DetailSection icon={FileText} title="Specifications">
        <DetailRow label="Model" value={vehicle.model} />
        <DetailRow label="Variant" value={vehicle.variant} />
        <DetailRow label="Color" value={vehicle.color} />
        <DetailRow label="Fuel Type" value={vehicle.fuelType} />
        <DetailRow label="Transmission" value={vehicle.transmissionType} />
        <DetailRow label="Year of Manufacture" value={vehicle.yearOfManufacture} />
      </DetailSection>

      {/* Pricing & Location */}
      <DetailSection icon={DollarSign} title="Pricing & Location">
        <DetailRow label="Price" value={formatCurrency(vehicle.price)} />
        <DetailRow label="Stockyard Location" value={vehicle.stockyardLocation} />
        <DetailRow label="Dealership ID" value={vehicle.dealershipId} />
      </DetailSection>

      {/* Dates */}
      <DetailSection icon={Calendar} title="Important Dates">
        <DetailRow label="Added Date" value={formatDate(vehicle.addedDate)} />
        <DetailRow label="Dispatch Date" value={formatDate(vehicle.dispatchDate)} />
        <DetailRow label="Created At" value={formatDateTime(vehicle.createdAt)} />
        <DetailRow label="Last Updated" value={formatDateTime(vehicle.updatedAt)} />
      </DetailSection>

      {/* Additional Info */}
      {vehicle.notes && (
        <DetailSection icon={StickyNote} title="Additional Notes">
          <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6 }}>
            {vehicle.notes}
          </p>
        </DetailSection>
      )}
    </div>
  );
};

export default VehicleDetailsModal;
