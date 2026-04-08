import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { Plus, Eye, Edit, UserX, List, Grid, Filter, X } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/Modal';
import AddCustomerForm from '../components/customer/AddCustomerForm';
import Customer360Modal from '../components/customer/Customer360Modal';
import MobileCard from '../components/ui/MobileCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getErrorMessage } from '../utils/errorHandler';
import { SkeletonTable, SkeletonCards } from '../components/ui/SkeletonLoader';
import InlineEdit from '../components/ui/InlineEdit';

const Customers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [show360Modal, setShow360Modal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [toast, setToast] = useState('');

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    customerType: '',
    fromDate: '',
    toDate: ''
  });

  // View mode state
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: customers, isLoading, error, refetch } = useQuery({
    queryKey: ['customers', searchTerm, filters],
    queryFn: () => customerService.getAllCustomers(searchTerm, filters),
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setToast('Customer deactivated successfully');
      setTimeout(() => setToast(''), 3000);
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    },
    onError: (error) => {
      setToast(getErrorMessage(error));
      setTimeout(() => setToast(''), 3000);
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    },
  });

  const updatePhoneMutation = useMutation({
    mutationFn: ({ id, phone }) => customerService.updateCustomerPhone(id, phone),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: ({ id, email }) => customerService.updateCustomerEmail(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });

  // Client-side pagination
  const paginatedData = useMemo(() => {
    const allCustomers = customers?.data || [];
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      content: allCustomers.slice(startIndex, endIndex),
      totalElements: allCustomers.length,
      totalPages: Math.ceil(allCustomers.length / pageSize),
    };
  }, [customers, page, pageSize]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleDeactivate = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete.customerId);
    }
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(val => val !== '').length;
  }, [filters]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      city: '',
      customerType: '',
      fromDate: '',
      toDate: ''
    });
    setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          backgroundColor: toast.includes('success') || toast.includes('deactivated') ? '#15803D' : '#DC2626',
          color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 8,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}
      <PageHeader
        title="Customers"
        subtitle={`${paginatedData.totalElements} customers`}
      >
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add Customer</span>
        </button>
      </PageHeader>

      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setPage(0); // Reset to first page on search
            }}
            placeholder="Search by name, email, or phone..."
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
              style={{ position: 'relative' }}
            >
              <Filter style={{ width: 14, height: 14 }} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  backgroundColor: '#DC2626',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
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
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel" style={{
            backgroundColor: '#F9FAFB',
            padding: '1rem',
            borderRadius: 8,
            marginBottom: '1rem',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Customer Type</label>
                <select
                  className="form-input"
                  value={filters.customerType}
                  onChange={(e) => handleFilterChange('customerType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="CORPORATE">Corporate</option>
                </select>
              </div>
              <div>
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                />
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={clearFilters}
                >
                  <X style={{ width: 14, height: 14 }} />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          viewMode === 'card' || isMobile ? (
            <SkeletonCards count={5} />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="hidden md:table-cell">Email</th>
                    <th className="hidden lg:table-cell">Phone</th>
                    <th className="hidden xl:table-cell">City</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <SkeletonTable rows={5} columns={6} />
                </tbody>
              </table>
            </div>
          )
        ) : error ? (
          <ErrorMessage message={error.message || 'Failed to load customers'} onRetry={refetch} />
        ) : paginatedData.content.length === 0 ? (
          <div className="table-empty">
            <p className="text-sm font-medium">No customers found</p>
          </div>
        ) : (
          <>
            {viewMode === 'card' || isMobile ? (
              <div className="mobile-view fade-in">
                {paginatedData.content.map((customer) => (
                  <MobileCard
                    key={customer.customerId}
                    fields={[
                      { label: 'Name', value: customer.fullName },
                      { label: 'Email', value: customer.email },
                      { label: 'Phone', value: customer.phone },
                      { label: 'City', value: customer.city },
                      { 
                        label: 'Type', 
                        render: () => <span className="badge badge-info">{customer.customerType}</span>
                      }
                    ]}
                    actions={
                      <>
                        <button
                          onClick={() => { setSelectedCustomer(customer); setShow360Modal(true); }}
                          className="btn btn-sm btn-secondary"
                        >
                          <Eye style={{ width: 14, height: 14 }} />
                          View 360°
                        </button>
                        <button
                          onClick={() => { setSelectedCustomer(customer); setShowEditModal(true); }}
                          className="btn btn-sm btn-primary"
                        >
                          <Edit style={{ width: 14, height: 14 }} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(customer)}
                          className="btn btn-sm btn-danger"
                        >
                          <UserX style={{ width: 14, height: 14 }} />
                          Deactivate
                        </button>
                      </>
                    }
                    onClick={() => { setSelectedCustomer(customer); setShow360Modal(true); }}
                  />
                ))}
              </div>
            ) : (
              <div className="table-wrapper fade-in">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="hidden md:table-cell">Email</th>
                      <th className="hidden lg:table-cell">Phone</th>
                      <th className="hidden xl:table-cell">City</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.content.map((customer) => (
                      <tr key={customer.customerId}>
                        <td className="td-primary">{customer.fullName}</td>
                        <td className="hidden md:table-cell">
                          <InlineEdit
                            value={customer.email}
                            type="email"
                            onSave={async (newEmail) => {
                              await updateEmailMutation.mutateAsync({ 
                                id: customer.customerId, 
                                email: newEmail 
                              });
                            }}
                            validator={(val) => {
                              if (!val) return 'Email is required';
                              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Invalid email format';
                              return null;
                            }}
                          />
                        </td>
                        <td className="hidden lg:table-cell">
                          <InlineEdit
                            value={customer.phone}
                            type="tel"
                            onSave={async (newPhone) => {
                              await updatePhoneMutation.mutateAsync({ 
                                id: customer.customerId, 
                                phone: newPhone 
                              });
                            }}
                            validator={(val) => {
                              if (!val) return 'Phone is required';
                              if (!/^\d{10}$/.test(val.replace(/\D/g, ''))) return 'Phone must be 10 digits';
                              return null;
                            }}
                          />
                        </td>
                        <td className="hidden xl:table-cell">{customer.city}</td>
                        <td>
                          <span className="badge badge-info">{customer.customerType}</span>
                        </td>
                        <td>
                          <div className="flex-gap-2">
                            <button
                              onClick={() => { setSelectedCustomer(customer); setShow360Modal(true); }}
                              className="btn btn-ghost btn-icon"
                              title="View 360°"
                            >
                              <Eye style={{ width: 15, height: 15, color: '#1D4ED8' }} />
                            </button>
                            <button
                              onClick={() => { setSelectedCustomer(customer); setShowEditModal(true); }}
                              className="btn btn-ghost btn-icon"
                              title="Edit"
                            >
                              <Edit style={{ width: 15, height: 15, color: '#15803D' }} />
                            </button>
                            <button
                              onClick={() => handleDeactivate(customer)}
                              className="btn btn-ghost btn-icon"
                              title="Deactivate"
                            >
                              <UserX style={{ width: 15, height: 15, color: '#DC2626' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {paginatedData.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={paginatedData.totalPages}
                totalElements={paginatedData.totalElements}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedCustomer(null);
        }}
        title={showEditModal ? "Edit Customer" : "Add New Customer"}
        size="lg"
      >
        <AddCustomerForm
          initialData={showEditModal ? selectedCustomer : null}
          onSuccess={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCustomer(null);
            queryClient.invalidateQueries({ queryKey: ['customers'] });
          }}
          onCancel={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCustomer(null);
          }}
        />
      </Modal>

      {/* View 360 Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={show360Modal}
          onClose={() => {
            setShow360Modal(false);
            setSelectedCustomer(null);
          }}
          title={`360° View: ${selectedCustomer?.name || selectedCustomer?.firstName} ${selectedCustomer?.lastName || ""}`}
          size="xl"
        >
          <Customer360Modal
            customerId={selectedCustomer.customerId}
            onClose={() => {
              setShow360Modal(false);
              setSelectedCustomer(null);
            }}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCustomerToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Deactivate Customer"
        message={`Are you sure you want to deactivate ${customerToDelete?.fullName || customerToDelete?.firstName}? This action will remove the customer from active listings.`}
        confirmText="Deactivate"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Customers;
