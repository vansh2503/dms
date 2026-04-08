import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { Plus, Download, Eye, Edit, Trash2, MapPin, Filter, X, List, Grid } from 'lucide-react';
import Modal from '../components/Modal';
import AddVehicleForm from '../components/inventory/AddVehicleForm';
import VehicleDetailsModal from '../components/inventory/VehicleDetailsModal';
import StockyardMapView from '../components/inventory/StockyardMapView';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import SearchBar from '../components/ui/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import MobileCard from '../components/ui/MobileCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getErrorMessage } from '../utils/errorHandler';
import { SkeletonTable, SkeletonCards } from '../components/ui/SkeletonLoader';
import InlineEdit from '../components/ui/InlineEdit';

const statuses = ['IN_TRANSIT', 'IN_STOCKYARD', 'IN_SHOWROOM', 'BOOKED', 'DISPATCHED', 'SOLD'];
const fuelTypes = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];
const transmissionTypes = ['MANUAL', 'AUTOMATIC', 'AMT', 'CVT', 'DCT'];
const models = ['Creta', 'Venue', 'Verna', 'i20', 'Alcazar', 'Tucson', 'Exter'];

const Inventory = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [toast, setToast] = useState('');

  // View mode state
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [filters, setFilters] = useState({
    search: '',
    model: '',
    status: '',
    fuelType: '',
    transmissionType: '',
    fromDate: '',
    toDate: '',
    dealershipId: '',
  });

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use the new filter endpoint with pagination
  const { data: vehiclesData, isLoading, refetch } = useQuery({
    queryKey: ['vehicles-paginated', filters, page, pageSize],
    queryFn: () => vehicleService.getVehiclesWithFilters({
      ...filters,
      page,
      size: pageSize,
      sort: 'vehicleId',
      dir: 'desc'
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: vehicleService.deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles-paginated']);
      setToast('Vehicle deleted successfully');
      setTimeout(() => setToast(''), 3000);
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      setToast(errorMessage);
      setTimeout(() => setToast(''), 5000); // Show error longer
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => vehicleService.updateVehicleStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['vehicles-paginated']),
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, price }) => vehicleService.updateVehiclePrice(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles-paginated']);
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
    setFilters({ search: '', model: '', status: '', fuelType: '', transmissionType: '', fromDate: '', toDate: '', dealershipId: '' });
    setPage(0);
  };

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleExport = () => alert('Export functionality will be implemented');
  const handleViewDetails = (v) => { setSelectedVehicle(v); setShowDetailsModal(true); };
  const handleEdit = (v) => { setSelectedVehicle(v); setShowAddModal(true); };
  const handleDelete = (vehicle) => { 
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (vehicleToDelete && vehicleToDelete.id) {
      deleteMutation.mutate(vehicleToDelete.id);
    } else {
      setToast('Invalid vehicle selected');
      setTimeout(() => setToast(''), 3000);
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
    }
  };
  const handleStatusChange = (id, status) => updateStatusMutation.mutate({ id, status });

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== filters.search).length;

  // Extract pagination data
  const vehicles = vehiclesData?.data?.content || [];
  const totalElements = vehiclesData?.data?.totalElements || 0;
  const totalPages = vehiclesData?.data?.totalPages || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          backgroundColor: toast.includes('success') || toast.includes('deleted') ? '#15803D' : '#DC2626',
          color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 8,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      <PageHeader
        title="Vehicle Inventory"
        subtitle={`${totalElements} vehicles in inventory`}
      >
        <button onClick={handleExport} className="btn btn-success btn-sm">
          <Download style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => { setSelectedVehicle(null); setShowAddModal(true); }}
          className="btn btn-primary btn-sm"
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add Vehicle</span>
        </button>
      </PageHeader>

      {/* Tabs + Search Row */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '0 1rem' }} className="tabs-bar">
          <button
            className={`tab-btn${activeTab === 'table' ? ' active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            Table View
          </button>
          <button
            className={`tab-btn${activeTab === 'map' ? ' active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <MapPin style={{ width: 13, height: 13 }} />
            <span className="hidden sm:inline">Stockyard Map</span>
          </button>
        </div>

        {activeTab === 'table' && (
          <div style={{ padding: '1rem' }}>
            {/* Search + Filter + View Toggle */}
            <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
              <SearchBar
                value={filters.search}
                onChange={(val) => handleFilterChange('search', val)}
                placeholder="Search by VIN or chassis number..."
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
                    <label className="form-label">Model</label>
                    <select className="form-select" value={filters.model} onChange={(e) => handleFilterChange('model', e.target.value)}>
                      <option value="">All Models</option>
                      {models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                      <option value="">All Status</option>
                      {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fuel Type</label>
                    <select className="form-select" value={filters.fuelType} onChange={(e) => handleFilterChange('fuelType', e.target.value)}>
                      <option value="">All Fuel Types</option>
                      {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <select className="form-select" value={filters.transmissionType} onChange={(e) => handleFilterChange('transmissionType', e.target.value)}>
                      <option value="">All Types</option>
                      {transmissionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input type="date" className="input-field" value={filters.fromDate} onChange={(e) => handleFilterChange('fromDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input type="date" className="input-field" value={filters.toDate} onChange={(e) => handleFilterChange('toDate', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      <X style={{ width: 13, height: 13 }} /> Clear
                    </button>
                  </div>
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
                        <th>VIN</th>
                        <th className="hidden md:table-cell">Model</th>
                        <th>Variant</th>
                        <th className="hidden lg:table-cell">Color</th>
                        <th className="hidden lg:table-cell">Fuel</th>
                        <th className="hidden lg:table-cell">Transmission</th>
                        <th className="hidden xl:table-cell">Arrival Date</th>
                        <th>Status</th>
                        <th className="hidden xl:table-cell">Location</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <SkeletonTable rows={5} columns={11} />
                    </tbody>
                  </table>
                </div>
              )
            ) : vehicles.length === 0 ? (
              <div className="table-empty">
                <p className="text-sm font-medium">No vehicles found</p>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'card' || isMobile ? (
                  <div className="mobile-view fade-in">
                    {vehicles.map((vehicle) => (
                      <MobileCard
                        key={vehicle.id}
                        fields={[
                          { label: 'VIN', value: vehicle.vin },
                          { label: 'Model', value: vehicle.model },
                          { label: 'Variant', value: vehicle.variant },
                          { label: 'Color', value: vehicle.color },
                          { label: 'Fuel Type', value: vehicle.fuelType },
                          { label: 'Transmission', value: vehicle.transmissionType || '—' },
                          { label: 'Arrival Date', value: vehicle.arrivalDate ? new Date(vehicle.arrivalDate).toLocaleDateString('en-IN') : '—' },
                          { 
                            label: 'Price', 
                            value: vehicle.price,
                            render: () => `₹${vehicle.price?.toLocaleString('en-IN')}`
                          },
                          { 
                            label: 'Status', 
                            render: () => <StatusBadge status={vehicle.status} />
                          },
                          { label: 'Location', value: vehicle.stockyardLocation || '—' }
                        ]}
                        actions={
                          <>
                            <button onClick={() => handleViewDetails(vehicle)} className="btn btn-sm btn-secondary">
                              <Eye style={{ width: 14, height: 14 }} />
                              View
                            </button>
                            <button onClick={() => handleEdit(vehicle)} className="btn btn-sm btn-primary">
                              <Edit style={{ width: 14, height: 14 }} />
                              Edit
                            </button>
                            <button onClick={() => handleDelete(vehicle)} className="btn btn-sm btn-danger">
                              <Trash2 style={{ width: 14, height: 14 }} />
                              Delete
                            </button>
                          </>
                        }
                        onClick={() => handleViewDetails(vehicle)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="table-wrapper fade-in">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>VIN</th>
                          <th className="hidden md:table-cell">Model</th>
                          <th>Variant</th>
                          <th className="hidden lg:table-cell">Color</th>
                          <th className="hidden lg:table-cell">Fuel</th>
                          <th className="hidden lg:table-cell">Transmission</th>
                          <th className="hidden xl:table-cell">Arrival Date</th>
                          <th>Status</th>
                          <th className="hidden xl:table-cell">Location</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td className="td-primary" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {vehicle.vin}
                            </td>
                            <td className="hidden md:table-cell">{vehicle.model}</td>
                            <td>{vehicle.variant}</td>
                            <td className="hidden lg:table-cell">{vehicle.color}</td>
                            <td className="hidden lg:table-cell">{vehicle.fuelType}</td>
                            <td className="hidden lg:table-cell">{vehicle.transmissionType || '—'}</td>
                            <td className="hidden xl:table-cell">
                              {vehicle.arrivalDate ? new Date(vehicle.arrivalDate).toLocaleDateString('en-IN') : '—'}
                            </td>
                            <td>
                              <select
                                value={vehicle.status}
                                onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                                className="form-select"
                                style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', fontSize: '0.6875rem', width: 'auto' }}
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                ))}
                              </select>
                            </td>
                            <td className="hidden xl:table-cell">{vehicle.stockyardLocation || '—'}</td>
                            <td>
                              <InlineEdit
                                value={vehicle.price}
                                type="number"
                                onSave={async (newPrice) => {
                                  await updatePriceMutation.mutateAsync({ 
                                    id: vehicle.id, 
                                    price: parseFloat(newPrice) 
                                  });
                                }}
                                formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                                validator={(val) => {
                                  const num = parseFloat(val);
                                  if (isNaN(num) || num <= 0) return 'Price must be greater than 0';
                                  return null;
                                }}
                              />
                            </td>
                            <td>
                              <div className="flex-gap-2">
                                <button onClick={() => handleViewDetails(vehicle)} className="btn btn-ghost btn-icon" title="View Details">
                                  <Eye style={{ width: 15, height: 15, color: '#1D4ED8' }} />
                                </button>
                                <button onClick={() => handleEdit(vehicle)} className="btn btn-ghost btn-icon" title="Edit">
                                  <Edit style={{ width: 15, height: 15, color: '#15803D' }} />
                                </button>
                                <button onClick={() => handleDelete(vehicle)} className="btn btn-ghost btn-icon" title="Delete">
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
        )}

        {activeTab === 'map' && (
          <div style={{ padding: '1rem' }}>
            <StockyardMapView vehicles={vehicles} />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedVehicle(null); }}
        title={selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        size="lg"
      >
        <AddVehicleForm
          vehicle={selectedVehicle}
          onSuccess={() => { setShowAddModal(false); setSelectedVehicle(null); refetch(); }}
          onCancel={() => { setShowAddModal(false); setSelectedVehicle(null); }}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedVehicle(null); }}
        title="Vehicle Details"
        size="lg"
      >
        <VehicleDetailsModal vehicle={selectedVehicle} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setVehicleToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete vehicle ${vehicleToDelete?.vin}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Inventory;
