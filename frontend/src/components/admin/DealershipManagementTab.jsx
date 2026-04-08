import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Filter, X } from 'lucide-react';
import Modal from '../Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import PageHeader from '../ui/PageHeader';
import SearchBar from '../ui/SearchBar';
import { StatusBadge } from '../ui/Badge';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import { SkeletonTable } from '../ui/SkeletonLoader';

const DealershipManagementTab = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDealership, setSelectedDealership] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dealershipToDelete, setDealershipToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: ''
  });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['dealerships'],
    queryFn: () => adminService.getAllDealerships()
  });

  const dealerships = response?.data || [];

  const filteredDealerships = dealerships.filter(d => {
    const matchesSearch = !filters.search ||
      d.dealershipName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      d.dealershipCode?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = !filters.location ||
      d.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      d.state?.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const uniqueLocations = [...new Set(dealerships.map(d => `${d.city}, ${d.state}`).filter(Boolean))];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => selectedDealership 
      ? adminService.updateDealership(selectedDealership.dealershipId, data)
      : adminService.createDealership(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['dealerships']);
      setShowAddModal(false);
      reset();
      setSelectedDealership(null);
      setToast(selectedDealership ? 'Dealership updated successfully' : 'Dealership created successfully');
      setTimeout(() => setToast(''), 3000);
    },
    onError: (err) => {
      setToast(getErrorMessage(err));
      setTimeout(() => setToast(''), 3000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteDealership(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['dealerships']);
      setToast('Dealership deleted successfully');
      setTimeout(() => setToast(''), 3000);
      setShowDeleteConfirm(false);
      setDealershipToDelete(null);
    },
    onError: (err) => {
      setToast(getErrorMessage(err));
      setTimeout(() => setToast(''), 3000);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleEdit = (dealership) => {
    setSelectedDealership(dealership);
    setShowAddModal(true);
    reset({
      dealershipCode: dealership.dealershipCode,
      dealershipName: dealership.dealershipName,
      address: dealership.address,
      city: dealership.city,
      state: dealership.state,
      pincode: dealership.pincode,
      phone: dealership.phone,
      email: dealership.email,
      managerName: dealership.managerName
    });
  };

  const handleDelete = (dealership) => {
    setDealershipToDelete(dealership);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (dealershipToDelete) {
      deleteMutation.mutate(dealershipToDelete.dealershipId);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '' });
  };

  const activeFilterCount = [filters.location].filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          backgroundColor: toast.includes('success') || toast.includes('deleted') || toast.includes('created') || toast.includes('updated') ? '#15803D' : '#DC2626',
          color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 8,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      <PageHeader
        title="Dealership Network"
        subtitle={`${filteredDealerships.length} of ${dealerships.length} locations`}
      >
        <button
          onClick={() => {
            setSelectedDealership(null);
            setShowAddModal(true);
            reset({ dealershipName: '', dealershipCode: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', managerName: '' });
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add Dealership</span>
        </button>
      </PageHeader>

      <div className="card" style={{ padding: '1rem' }}>
        {/* Search + Filter */}
        <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search by name or code..."
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
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
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#002C5F',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.75rem',
                alignItems: 'end',
              }}
            >
              <div className="form-group">
                <label className="form-label">Location</label>
                <select className="form-select" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
                  <option value="">All Locations</option>
                  {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <X style={{ width: 13, height: 13 }} /> Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th className="hidden md:table-cell">Location</th>
                  <th className="hidden lg:table-cell">Address</th>
                  <th className="hidden lg:table-cell">Phone</th>
                  <th className="hidden xl:table-cell">Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <SkeletonTable rows={5} columns={7} />
              </tbody>
            </table>
          </div>
        ) : filteredDealerships.length === 0 ? (
          <div className="table-empty">
            <p className="text-sm font-medium">No dealerships found</p>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="table-wrapper fade-in">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th className="hidden md:table-cell">Location</th>
                  <th className="hidden lg:table-cell">Address</th>
                  <th className="hidden lg:table-cell">Phone</th>
                  <th className="hidden xl:table-cell">Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDealerships.map((dealership) => (
                  <tr key={dealership.dealershipId}>
                    <td className="td-primary" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {dealership.dealershipCode}
                    </td>
                    <td>{dealership.dealershipName}</td>
                    <td className="hidden md:table-cell">{dealership.city}, {dealership.state}</td>
                    <td className="hidden lg:table-cell">{dealership.address || '—'}</td>
                    <td className="hidden lg:table-cell">{dealership.phone || '—'}</td>
                    <td className="hidden xl:table-cell">{dealership.managerName || '—'}</td>
                    <td>
                      <div className="flex-gap-2">
                        <button 
                          onClick={() => handleEdit(dealership)} 
                          className="btn btn-ghost btn-icon" 
                          title="Edit"
                          disabled={mutation.isPending || deleteMutation.isPending}
                        >
                          <Edit style={{ width: 15, height: 15, color: '#15803D' }} />
                        </button>
                        <button 
                          onClick={() => handleDelete(dealership)} 
                          className="btn btn-ghost btn-icon" 
                          title="Delete"
                          disabled={mutation.isPending || deleteMutation.isPending}
                        >
                          <Trash2 style={{ width: 15, height: 15, color: '#DC2626' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedDealership(null); reset(); }}
        title={selectedDealership ? 'Edit Dealership' : 'Add New Dealership'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label">Dealership Name</label>
              <input {...register('dealershipName', { required: 'Name is required' })} className="input-field" />
              {errors.dealershipName && <p className="text-red-500 text-xs mt-1">{errors.dealershipName.message}</p>}
            </div>

            <div>
              <label className="form-label">Dealership Code</label>
              <input {...register('dealershipCode', { required: 'Code is required' })} className="input-field" />
              {errors.dealershipCode && <p className="text-red-500 text-xs mt-1">{errors.dealershipCode.message}</p>}
            </div>
            <div>
              <label className="form-label">City</label>
              <input {...register('city', { required: 'City is required' })} className="input-field" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="form-label">State</label>
              <input {...register('state', { required: 'State is required' })} className="input-field" />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <label className="form-label">Pincode</label>
              <input {...register('pincode', { required: 'Pincode is required' })} className="input-field" />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input {...register('phone', { required: 'Phone is required' })} className="input-field" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" {...register('email')} className="input-field" />
            </div>

            <div className="col-span-2">
              <label className="form-label">Manager Name</label>
              <input {...register('managerName')} className="input-field" />
            </div>

            <div className="col-span-2">
              <label className="form-label">Address</label>
              <textarea {...register('address', { required: 'Address is required' })} rows={3} className="input-field" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
            <button type="button" onClick={() => { setShowAddModal(false); reset(); }} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn btn-primary">
              {mutation.isPending && <span className="spinner spinner-sm" />}
              {mutation.isPending ? 'Saving...' : selectedDealership ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDealershipToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Dealership"
        message={`Are you sure you want to delete ${dealershipToDelete?.dealershipName}? This will affect all assigned users and inventory records.`}
        confirmText="Delete Dealership"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default DealershipManagementTab;
