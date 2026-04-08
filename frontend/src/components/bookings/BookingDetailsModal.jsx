import { User, Car, FileText, XCircle, CheckCircle, Clock, Package } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import DetailRow from '../ui/DetailRow';
import DetailSection from '../ui/DetailSection';

const BookingDetailsModal = ({ booking }) => {
  if (!booking) return null;

  const formatCurrency = (amount) => amount != null ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN') : '—';

  // Timeline data
  const getTimeline = () => {
    const timeline = [
      {
        status: 'PENDING',
        label: 'Booking Created',
        date: booking.bookingDate,
        icon: Clock,
        completed: true
      },
      {
        status: 'CONFIRMED',
        label: 'Booking Confirmed',
        date: booking.confirmedDate,
        icon: CheckCircle,
        completed: booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'
      },
      {
        status: 'DISPATCHED',
        label: 'Vehicle Dispatched',
        date: booking.dispatchDate,
        icon: Package,
        completed: booking.status === 'COMPLETED'
      },
      {
        status: 'COMPLETED',
        label: 'Delivered',
        date: booking.deliveryDate,
        icon: CheckCircle,
        completed: booking.status === 'COMPLETED'
      }
    ];

    if (booking.status === 'CANCELLED') {
      timeline.push({
        status: 'CANCELLED',
        label: 'Booking Cancelled',
        date: booking.cancellationDate,
        icon: XCircle,
        completed: true,
        cancelled: true
      });
    }

    return timeline;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{booking.bookingNumber}</h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>
            Booked on {formatDate(booking.bookingDate)}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Customer Details */}
      <DetailSection icon={User} title="Customer Details">
        <DetailRow label="Name" value={booking.customerName} />
        <DetailRow label="Phone" value={booking.customerPhone} />
        <DetailRow label="Email" value={booking.customerEmail} />
      </DetailSection>

      {/* Vehicle Details */}
      <DetailSection icon={Car} title="Vehicle Details">
        <DetailRow label="Model" value={booking.vehicleModel} />
        <DetailRow label="Variant" value={booking.vehicleVariant} />
        <DetailRow label="Color" value={booking.vehicleColor} />
        <DetailRow label="VIN" value={booking.vehicleVin} />
      </DetailSection>

      {/* Booking Details */}
      <DetailSection icon={FileText} title="Booking Information">
        <DetailRow label="Booking Amount" value={formatCurrency(booking.bookingAmount)} />
        <DetailRow label="Expected Delivery" value={formatDate(booking.expectedDeliveryDate)} />
        <DetailRow label="Sales Executive" value={booking.salesExecutiveName} />
        <DetailRow label="Dealership" value={booking.dealershipName} />
      </DetailSection>

      {/* Cancellation Details */}
      {booking.status === 'CANCELLED' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
            <XCircle style={{ width: 15, height: 15, color: '#DC2626' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cancellation Details
            </span>
          </div>
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.75rem 1rem' }}>
            <DetailRow label="Cancellation Date" value={formatDate(booking.cancellationDate)} />
            <DetailRow label="Reason" value={booking.cancellationReason} />
            <DetailRow label="Cancellation Charges" value={formatCurrency(booking.cancellationCharges)} />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#002C5F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Booking Timeline
        </h4>
        <div style={{ position: 'relative' }}>
          {getTimeline().map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: index < getTimeline().length - 1 ? '1.5rem' : 0 }}>
                {/* Timeline Line */}
                {index < getTimeline().length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: 16,
                    top: 32,
                    width: 2,
                    height: 40,
                    backgroundColor: '#E2E8F0'
                  }} />
                )}
                
                {/* Icon */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: item.cancelled ? '#FEF2F2' : item.completed ? '#F0FDF4' : '#F8FAFC'
                }}>
                  <Icon style={{
                    width: 16,
                    height: 16,
                    color: item.cancelled ? '#DC2626' : item.completed ? '#15803D' : '#94A3B8'
                  }} />
                </div>

                {/* Content */}
                <div style={{ marginLeft: '1rem', flex: 1 }}>
                  <p style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: item.cancelled ? '#DC2626' : item.completed ? '#0F172A' : '#64748B'
                  }}>
                    {item.label}
                  </p>
                  {item.date && (
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.125rem' }}>
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
