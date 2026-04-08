import { User, Car, Calendar, MessageSquare } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import DetailRow from '../ui/DetailRow';
import DetailSection from '../ui/DetailSection';

const TestDriveDetailsModal = ({ testDrive }) => {
  if (!testDrive) return null;

  const formatDateTime = (date) => date ? new Date(date).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }) : '—';

  const formatDate = (date) => date ? new Date(date).toLocaleString('en-IN') : '—';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Test Drive Details</h3>
        <StatusBadge status={testDrive.status} />
      </div>

      {/* Customer Information */}
      <DetailSection icon={User} title="Customer Information">
        <DetailRow label="Name" value={testDrive.customerName} />
        <DetailRow label="Phone" value={testDrive.customerPhone} />
        <DetailRow label="Email" value={testDrive.customerEmail} />
        <DetailRow label="License Number" value={testDrive.driverLicenseNumber} />
      </DetailSection>

      {/* Vehicle Information */}
      <DetailSection icon={Car} title="Vehicle Information">
        <DetailRow label="Model" value={testDrive.vehicleModel} />
        <DetailRow label="Variant" value={testDrive.vehicleVariant} />
        <DetailRow label="Color" value={testDrive.vehicleColor} />
        <DetailRow label="Fuel Type" value={testDrive.vehicleFuelType} />
      </DetailSection>

      {/* Schedule */}
      <DetailSection icon={Calendar} title="Schedule">
        <DetailRow label="Date & Time" value={formatDateTime(testDrive.scheduledDateTime)} />
        <DetailRow label="Created At" value={formatDate(testDrive.createdAt)} />
      </DetailSection>

      {/* Feedback */}
      {testDrive.status === 'COMPLETED' && testDrive.feedback && (
        <DetailSection icon={MessageSquare} title="Customer Feedback">
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 8,
            padding: '1rem',
            marginTop: '0.5rem'
          }}>
            <p style={{ fontSize: '0.8125rem', color: '#1E40AF', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {testDrive.feedback}
            </p>
          </div>
        </DetailSection>
      )}
    </div>
  );
};

export default TestDriveDetailsModal;
