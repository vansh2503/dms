import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import { Mail, Phone, MapPin, Calendar, Package, Car, RotateCw, ShoppingBag } from 'lucide-react';
import Loading from '../Loading';
import DetailRow from '../ui/DetailRow';
import DetailSection from '../ui/DetailSection';

const Customer360Modal = ({ customerId, onClose }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer360', customerId],
    queryFn: () => customerService.getCustomer360View(customerId),
    enabled: !!customerId
  });

  if (isLoading) return <Loading message="Loading 360° Data..." />;
  if (error || !data) return <div className="p-4 text-red-500">Failed to load customer data.</div>;

  const { customer, bookings, testDrives, exchangeRequests, accessoryOrders, statistics } = data;

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN') : '—';

  return (
    <div style={{ maxHeight: '75vh', overflowY: 'auto', padding: '0 2px' }}>
      
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #BFDBFE', borderRadius: 8, backgroundColor: '#EFF6FF' }}>
          <p style={{ fontSize: '0.6875rem', color: '#1D4ED8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Bookings</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E3A8A', marginTop: '0.25rem' }}>{statistics?.totalBookings || 0}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #BBF7D0', borderRadius: 8, backgroundColor: '#F0FDF4' }}>
          <p style={{ fontSize: '0.6875rem', color: '#15803D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Drives</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#166534', marginTop: '0.25rem' }}>{statistics?.totalTestDrives || 0}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #DDD6FE', borderRadius: 8, backgroundColor: '#F5F3FF' }}>
          <p style={{ fontSize: '0.6875rem', color: '#7C3AED', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exchanges</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6D28D9', marginTop: '0.25rem' }}>{statistics?.totalExchangeRequests || 0}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #FED7AA', borderRadius: 8, backgroundColor: '#FFEDD5' }}>
          <p style={{ fontSize: '0.6875rem', color: '#C2410C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loyalty Points</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9A3412', marginTop: '0.25rem' }}>{customer?.loyaltyPoints || 0} pts</p>
        </div>
      </div>

      {/* Customer Details */}
      <DetailSection icon={Mail} title="Customer Details">
        <DetailRow label="Email" value={customer?.email} />
        <DetailRow label="Phone" value={customer?.phone} />
        <DetailRow label="Address" value={customer?.address ? `${customer.address}, ${customer.city || ''}` : null} />
        <DetailRow label="Date of Birth" value={formatDate(customer?.dateOfBirth)} />
        <DetailRow label="Customer Type" value={customer?.customerType} />
      </DetailSection>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        
        {/* Bookings */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '1rem', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package style={{ width: 16, height: 16, color: '#002C5F' }} />
              Bookings
            </h4>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#002C5F', color: '#fff', padding: '0.125rem 0.5rem', borderRadius: 9999 }}>
              {bookings?.length || 0}
            </span>
          </div>
          {bookings?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {bookings.map((b) => (
                <div key={b.bookingId} style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0F172A' }}>{b.variantName || 'Vehicle Booking'}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>#{b.bookingNumber}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: 4, display: 'inline-block', backgroundColor: b.status === 'COMPLETED' ? '#F0FDF4' : '#FFFBEB', color: b.status === 'COMPLETED' ? '#15803D' : '#B45309' }}>
                      {b.status}
                    </span>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem' }}>₹{b.bookingAmount?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: '#64748B', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>No bookings found.</p>
          )}
        </div>

        {/* Test Drives */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '1rem', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car style={{ width: 16, height: 16, color: '#002C5F' }} />
              Test Drives
            </h4>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#002C5F', color: '#fff', padding: '0.125rem 0.5rem', borderRadius: 9999 }}>
              {testDrives?.length || 0}
            </span>
          </div>
          {testDrives?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {testDrives.map((td) => (
                <div key={td.testDriveId} style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0F172A' }}>{td.variantName}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Date: {td.scheduledDate}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: 4, display: 'inline-block', backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                      {td.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: '#64748B', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>No test drives logged.</p>
          )}
        </div>

        {/* Exchange Requests */}
        {exchangeRequests && exchangeRequests.length > 0 && (
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '1rem', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCw style={{ width: 16, height: 16, color: '#002C5F' }} />
                Exchange Requests
              </h4>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#002C5F', color: '#fff', padding: '0.125rem 0.5rem', borderRadius: 9999 }}>
                {exchangeRequests.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {exchangeRequests.map((ex) => (
                <div key={ex.exchangeId} style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0F172A' }}>{ex.oldVehicleMake} {ex.oldVehicleModel}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Status: {ex.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Customer360Modal;
