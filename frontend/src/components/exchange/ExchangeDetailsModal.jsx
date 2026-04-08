import { Car, User, FileText } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import DetailRow from '../ui/DetailRow';
import DetailSection from '../ui/DetailSection';

const ExchangeDetailsModal = ({ exchange }) => {
  if (!exchange) return null;

  const formatCurrency = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN')}` : '—';
  const diff = exchange.valuationAmount != null && exchange.offeredAmount != null
    ? Number(exchange.offeredAmount) - Number(exchange.valuationAmount)
    : null;

  return (
    <div>
      {/* Status banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Exchange ID #{exchange.exchangeId}</p>
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Booking: {exchange.bookingNumber}</p>
        </div>
        <StatusBadge status={exchange.status} />
      </div>

      <DetailSection icon={User} title="Customer">
        <DetailRow label="Name" value={exchange.customerName} />
      </DetailSection>

      <DetailSection icon={Car} title="Old Vehicle (Trade-in)">
        <DetailRow label="Make & Model" value={`${exchange.oldVehicleMake} ${exchange.oldVehicleModel}`} />
        <DetailRow label="Variant" value={exchange.oldVehicleVariant} />
        <DetailRow label="Year" value={exchange.oldVehicleYear} />
        <DetailRow label="Registration" value={exchange.oldVehicleRegistration} />
        <DetailRow 
          label="KM Driven" 
          value={exchange.oldVehicleKmDriven}
          formatter={(val) => val != null ? `${val.toLocaleString('en-IN')} km` : '—'}
        />
        <DetailRow label="Condition" value={exchange.oldVehicleCondition} />
      </DetailSection>

      <DetailSection icon={Car} title="New Vehicle (Booking)">
        <DetailRow label="Model" value={exchange.newVehicleModel} />
        <DetailRow label="Variant" value={exchange.newVehicleVariant} />
      </DetailSection>

      <DetailSection icon={FileText} title="Valuation">
        <DetailRow label="Estimated Valuation" value={formatCurrency(exchange.valuationAmount)} />
        <DetailRow label="Offered Amount" value={formatCurrency(exchange.offeredAmount)} />
        {diff != null && (
          <DetailRow 
            label="Difference" 
            value={
              <span style={{ color: diff >= 0 ? '#15803D' : '#DC2626', fontWeight: 600 }}>
                {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
              </span>
            } 
          />
        )}
        <DetailRow label="Evaluation Date" value={exchange.evaluationDate} />
        <DetailRow label="Evaluated By" value={exchange.evaluatedBy} />
      </DetailSection>

      {exchange.remarks && (
        <DetailSection icon={FileText} title="Remarks">
          <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>{exchange.remarks}</p>
        </DetailSection>
      )}

      {exchange.createdAt && (
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'right' }}>
          Created: {exchange.createdAt}
        </p>
      )}
    </div>
  );
};

export default ExchangeDetailsModal;
