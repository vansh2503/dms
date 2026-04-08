import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { adminService } from '../services/adminService';
import { Plus, Eye, XCircle, Printer, Filter, X, List, Grid } from 'lucide-react';
import Modal from '../components/Modal';
import NewBookingForm from '../components/bookings/NewBookingForm';
import BookingDetailsModal from '../components/bookings/BookingDetailsModal';
import CancelBookingModal from '../components/bookings/CancelBookingModal';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import SearchBar from '../components/ui/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import MobileCard from '../components/ui/MobileCard';
import { SkeletonTable, SkeletonCards } from '../components/ui/SkeletonLoader';
import InlineEdit from '../components/ui/InlineEdit';
import { getErrorMessage } from '../utils/errorHandler';

const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const Bookings = () => {
  const queryClient = useQueryClient();
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // View mode state
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [filters, setFilters] = useState({
    dealershipId: '',
    salesExecutiveId: '',
    status: '',
    paymentMode: '',
    bookingDateFrom: '',
    bookingDateTo: '',
    search: '',
  });

  // Dropdown data state
  const [dealerships, setDealerships] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch dropdown data for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch dealerships
        const dealershipsRes = await adminService.getAllDealerships();
        setDealerships(dealershipsRes.data || []);

        // Fetch users (sales executives)
        const usersRes = await adminService.getAllUsers();
        setSalesExecutives(usersRes.data || []);

        // Set payment modes (common values)
        setPaymentModes(['Cash', 'Finance', 'Lease', 'Bank Transfer', 'Cheque']);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  // Use the new filter endpoint with pagination
  const { data: bookingsData, isLoading, refetch } = useQuery({
    queryKey: ['bookings-paginated', filters, page, pageSize],
    queryFn: () => bookingService.getBookingsWithFilters({
      ...filters,
      page,
      size: pageSize,
      sort: 'bookingId',
      dir: 'desc'
    }),
  });

  // Mutation for updating booking status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings-paginated']);
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });

  // Mutation for updating delivery date
  const updateDeliveryDateMutation = useMutation({
    mutationFn: ({ id, date }) => bookingService.updateDeliveryDate(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings-paginated']);
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ 
      dealershipId: '',
      salesExecutiveId: '',
      status: '', 
      paymentMode: '',
      bookingDateFrom: '', 
      bookingDateTo: '', 
      search: '',
    });
    setPage(0);
  };

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleViewDetails = (b) => { setSelectedBooking(b); setShowDetailsModal(true); };
  const handleCancelBooking = (b) => { setSelectedBooking(b); setShowCancelModal(true); };

  const handlePrintReceipt = (booking) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Booking Receipt - ${booking.bookingNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px solid #eee; padding: 8px 0; }
            .label { font-weight: bold; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Hyundai DMS</h1>
            <h2>Booking Receipt</h2>
          </div>
          <div class="row"><span class="label">Booking Number:</span><span>${booking.bookingNumber}</span></div>
          <div class="row"><span class="label">Customer:</span><span>${booking.customerName}</span></div>
          <div class="row"><span class="label">Vehicle:</span><span>${booking.vehicleModel}</span></div>
          <div class="row"><span class="label">Booking Amount:</span><span>₹${booking.bookingAmount?.toLocaleString('en-IN')}</span></div>
          <div class="row"><span class="label">Booking Date:</span><span>${new Date(booking.bookingDate).toLocaleDateString('en-IN')}</span></div>
          <div class="row"><span class="label">Expected Delivery:</span><span>${new Date(booking.expectedDeliveryDate).toLocaleDateString('en-IN')}</span></div>
          <div class="row"><span class="label">Status:</span><span>${booking.status}</span></div>
          <button onclick="window.print()" style="margin-top:20px;padding:8px 16px;">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const activeFilterCount = [
    filters.dealershipId,
    filters.salesExecutiveId,
    filters.status, 
    filters.paymentMode,
    filters.bookingDateFrom, 
    filters.bookingDateTo
  ].filter(Boolean).length;

  // Extract pagination data
  const bookings = bookingsData?.data?.content || [];
  const totalElements = bookingsData?.data?.totalElements || 0;
  const totalPages = bookingsData?.data?.totalPages || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="Bookings"
        subtitle={`${totalElements} total bookings`}
      >
        <button onClick={() => setShowNewBookingModal(true)} className="btn btn-primary btn-sm">
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">New Booking</span>
        </button>
      </PageHeader>

      <div className="card" style={{ padding: '1rem' }}>
        {/* Search + Filter + View Toggle */}
        <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search by booking number or customer..."
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isMobile && (
              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <List style={{ width: 14, height: 14 }} />
                  Table
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  title="Card View"
                >
                  <Grid style={{ width: 14, height: 14 }} />
                  Cards
                </button>
              </div>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary btn-sm"
              style={{ position: 'relative' }}
            >
              <Filter style={{ width: 14, height: 14 }} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 16, height: 16, borderRadius: '50%',
                    backgroundColor: '#002C5F', color: '#fff',
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
              alignItems: 'end',
            }}
          >
            <div className="form-group">
              <label className="form-label">Dealership</label>
              <select className="form-select" value={filters.dealershipId} onChange={(e) => handleFilterChange('dealershipId', e.target.value)}>
                <option value="">All Dealerships</option>
                {dealerships.map((d) => <option key={d.dealershipId} value={d.dealershipId}>{d.dealershipName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sales Executive</label>
              <select className="form-select" value={filters.salesExecutiveId} onChange={(e) => handleFilterChange('salesExecutiveId', e.target.value)}>
                <option value="">All Executives</option>
                {salesExecutives.map((u) => <option key={u.userId} value={u.userId}>{u.fullName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All Status</option>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select className="form-select" value={filters.paymentMode} onChange={(e) => handleFilterChange('paymentMode', e.target.value)}>
                <option value="">All Modes</option>
                {paymentModes.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Booking From Date</label>
              <input type="date" className="input-field" value={filters.bookingDateFrom} onChange={(e) => handleFilterChange('bookingDateFrom', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Booking To Date</label>
              <input type="date" className="input-field" value={filters.bookingDateTo} onChange={(e) => handleFilterChange('bookingDateTo', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <X style={{ width: 13, height: 13 }} /> Clear
              </button>
            </div>
          </div>
        )}

        {/* Table or Card View */}
        {isLoading ? (
          viewMode === 'card' || isMobile ? (
            <SkeletonCards count={5} />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking No.</th>
                    <th className="hidden md:table-cell">Customer</th>
                    <th>Vehicle</th>
                    <th className="hidden lg:table-cell">Variant</th>
                    <th className="hidden xl:table-cell">Dealership</th>
                    <th className="hidden xl:table-cell">Sales Executive</th>
                    <th className="hidden lg:table-cell">Amount</th>
                    <th className="hidden md:table-cell">Booking Date</th>
                    <th className="hidden xl:table-cell">Delivery Date</th>
                    <th className="hidden lg:table-cell">Payment Mode</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <SkeletonTable rows={5} columns={12} />
                </tbody>
              </table>
            </div>
          )
        ) : bookings.length === 0 ? (
          <div className="table-empty">
            <p className="text-sm font-medium">No bookings found</p>
          </div>
        ) : (
          <>
            {viewMode === 'card' || isMobile ? (
              <div className="mobile-view fade-in">
                {bookings.map((booking) => (
                  <MobileCard
                    key={booking.bookingId}
                    fields={[
                      { label: 'Booking No.', value: booking.bookingNumber },
                      { label: 'Customer', value: booking.customerName },
                      { label: 'Vehicle', value: booking.vehicleModel },
                      { label: 'Variant', value: booking.variantName || '—' },
                      { label: 'Dealership', value: booking.dealershipName || '—' },
                      { label: 'Sales Executive', value: booking.salesExecutiveName || '—' },
                      { 
                        label: 'Booking Amount', 
                        value: booking.bookingAmount,
                        render: () => `₹${booking.bookingAmount?.toLocaleString('en-IN')}`
                      },
                      { 
                        label: 'Booking Date', 
                        value: booking.bookingDate,
                        render: () => booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : '—'
                      },
                      { 
                        label: 'Expected Delivery', 
                        value: booking.expectedDeliveryDate,
                        render: () => booking.expectedDeliveryDate ? new Date(booking.expectedDeliveryDate).toLocaleDateString('en-IN') : '—'
                      },
                      { label: 'Payment Mode', value: booking.paymentMode || '—' },
                      { 
                        label: 'Status', 
                        render: () => <StatusBadge status={booking.status} />
                      }
                    ]}
                    actions={
                      <>
                        <button onClick={() => handleViewDetails(booking)} className="btn btn-sm btn-secondary">
                          <Eye style={{ width: 14, height: 14 }} />
                          View
                        </button>
                        <button onClick={() => handlePrintReceipt(booking)} className="btn btn-sm btn-ghost">
                          <Printer style={{ width: 14, height: 14 }} />
                          Print
                        </button>
                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                          <button onClick={() => handleCancelBooking(booking)} className="btn btn-sm btn-danger">
                            <XCircle style={{ width: 14, height: 14 }} />
                            Cancel
                          </button>
                        )}
                      </>
                    }
                    onClick={() => handleViewDetails(booking)}
                  />
                ))}
              </div>
            ) : (
              <div className="table-wrapper fade-in">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Booking No.</th>
                      <th className="hidden md:table-cell">Customer</th>
                      <th>Vehicle</th>
                      <th className="hidden lg:table-cell">Variant</th>
                      <th className="hidden xl:table-cell">Dealership</th>
                      <th className="hidden xl:table-cell">Sales Executive</th>
                      <th className="hidden lg:table-cell">Amount</th>
                      <th className="hidden md:table-cell">Booking Date</th>
                      <th className="hidden xl:table-cell">Delivery Date</th>
                      <th className="hidden lg:table-cell">Payment Mode</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.bookingId}>
                        <td className="td-primary">{booking.bookingNumber}</td>
                        <td className="hidden md:table-cell">{booking.customerName}</td>
                        <td>{booking.vehicleModel}</td>
                        <td className="hidden lg:table-cell">{booking.variantName || '—'}</td>
                        <td className="hidden xl:table-cell">{booking.dealershipName || '—'}</td>
                        <td className="hidden xl:table-cell">{booking.salesExecutiveName || '—'}</td>
                        <td className="hidden lg:table-cell" style={{ fontWeight: 500 }}>
                          ₹{booking.bookingAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="hidden md:table-cell">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="hidden xl:table-cell">
                          <InlineEdit
                            value={booking.expectedDeliveryDate ? new Date(booking.expectedDeliveryDate).toISOString().split('T')[0] : ''}
                            type="date"
                            onSave={async (newDate) => {
                              await updateDeliveryDateMutation.mutateAsync({ 
                                id: booking.bookingId, 
                                date: newDate 
                              });
                            }}
                            formatter={(val) => val ? new Date(val).toLocaleDateString('en-IN') : '—'}
                          />
                        </td>
                        <td className="hidden lg:table-cell">{booking.paymentMode || '—'}</td>
                        <td>
                          <InlineEdit
                            value={booking.status}
                            type="select"
                            options={statuses.map(s => ({ value: s, label: s }))}
                            onSave={async (newStatus) => {
                              await updateStatusMutation.mutateAsync({ 
                                id: booking.bookingId, 
                                status: newStatus 
                              });
                            }}
                            renderDisplay={() => <StatusBadge status={booking.status} />}
                          />
                        </td>
                        <td>
                          <div className="flex-gap-2">
                            <button onClick={() => handleViewDetails(booking)} className="btn btn-ghost btn-icon" title="View Details">
                              <Eye style={{ width: 15, height: 15, color: '#1D4ED8' }} />
                            </button>
                            <button onClick={() => handlePrintReceipt(booking)} className="btn btn-ghost btn-icon" title="Print Receipt">
                              <Printer style={{ width: 15, height: 15, color: '#15803D' }} />
                            </button>
                            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                              <button onClick={() => handleCancelBooking(booking)} className="btn btn-ghost btn-icon" title="Cancel Booking">
                                <XCircle style={{ width: 15, height: 15, color: '#DC2626' }} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showNewBookingModal} onClose={() => setShowNewBookingModal(false)} title="New Booking" size="lg">
        <NewBookingForm
          onSuccess={() => { setShowNewBookingModal(false); refetch(); }}
          onCancel={() => setShowNewBookingModal(false)}
        />
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedBooking(null); }} title="Booking Details" size="lg">
        <BookingDetailsModal booking={selectedBooking} />
      </Modal>

      <Modal isOpen={showCancelModal} onClose={() => { setShowCancelModal(false); setSelectedBooking(null); }} title="Cancel Booking" size="md">
        <CancelBookingModal
          booking={selectedBooking}
          onSuccess={() => { setShowCancelModal(false); setSelectedBooking(null); refetch(); }}
          onCancel={() => { setShowCancelModal(false); setSelectedBooking(null); }}
        />
      </Modal>
    </div>
  );
};

export default Bookings;
