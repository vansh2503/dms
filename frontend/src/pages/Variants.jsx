import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { variantService } from '../services/variantService';
import { modelService } from '../services/modelService';
import { Plus, Eye, Edit3, Trash2, Filter, X } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/Modal';
import VariantForm from '../components/variants/VariantForm';
import VariantDetails from '../components/variants/VariantDetails';

const fuelTypes = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];
const transmissionTypes = ['MANUAL', 'AUTOMATIC', 'AMT', 'CVT', 'DCT'];

const Variants = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    modelId: '',
    fuelType: '',
    transmission: '',
  });

  // Fetch models for dropdown
  const [models, setModels] = useState([]);
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await modelService.getAllModels();
        setModels(response.data || []);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  const { data: variants, isLoading, error, refetch } = useQuery({
    queryKey: ['variants', filters],
    queryFn: () => variantService.getAllVariants(filters),
  });

  // Client-side pagination
  const paginatedData = useMemo(() => {
    const allVariants = variants?.data || [];
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      content: allVariants.slice(startIndex, endIndex),
      totalElements: allVariants.length,
      totalPages: Math.ceil(allVariants.length / pageSize),
    };
  }, [variants, page, pageSize]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ search: '', modelId: '', fuelType: '', transmission: '' });
    setPage(0);
  };

  const activeFilterCount = [
    filters.modelId,
    filters.fuelType,
    filters.transmission,
  ].filter(Boolean).length;

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleAdd = () => {
    setSelectedVariant(null);
    setIsEdit(false);
    setShowFormModal(true);
  };

  const handleEdit = (v) => {
    setSelectedVariant(v);
    setIsEdit(true);
    setShowFormModal(true);
  };

  const handleView = (v) => {
    setSelectedVariant(v);
    setShowDetailsModal(true);
  };

  const handleDelete = (v) => {
    setSelectedVariant(v);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVariant) return;
    
    setIsDeleting(true);
    try {
      await variantService.deleteVariant(selectedVariant.variantId);
      alert('Variant deleted successfully');
      setShowDeleteModal(false);
      setSelectedVariant(null);
      refetch();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete variant');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="Vehicle Variants"
        subtitle={`${paginatedData.totalElements} variants`}
      >
        <button onClick={handleAdd} className="btn btn-primary btn-sm">
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add Variant</span>
        </button>
      </PageHeader>

      <div className="card" style={{ padding: '1rem' }}>
        {isLoading ? (
          <Loading message="Loading variants..." />
        ) : error ? (
          <ErrorMessage message={error.message || 'Failed to load variants'} onRetry={refetch} />
        ) : (
          <>
            {/* Search + Filter Bar */}
            <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
              <SearchBar
                value={filters.search}
                onChange={(val) => handleFilterChange('search', val)}
                placeholder="Search by variant name or code..."
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

            {/* Filter Panel */}
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
                  <label className="form-label">Model</label>
                  <select 
                    className="form-select" 
                    value={filters.modelId} 
                    onChange={(e) => handleFilterChange('modelId', e.target.value)}
                  >
                    <option value="">All Models</option>
                    {models.map((model) => (
                      <option key={model.modelId} value={model.modelId}>{model.modelName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select 
                    className="form-select" 
                    value={filters.fuelType} 
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  >
                    <option value="">All Fuel Types</option>
                    {fuelTypes.map((fuel) => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Transmission</label>
                  <select 
                    className="form-select" 
                    value={filters.transmission} 
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  >
                    <option value="">All Transmissions</option>
                    {transmissionTypes.map((trans) => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button 
                    onClick={clearFilters} 
                    className="btn btn-ghost btn-sm" 
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <X style={{ width: 13, height: 13 }} /> Clear
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th className="hidden md:table-cell">Variant</th>
                    <th className="hidden lg:table-cell">Code</th>
                    <th className="hidden xl:table-cell">Fuel Type</th>
                    <th className="hidden xl:table-cell">Transmission</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.content.map((v) => (
                    <tr key={v.variantId}>
                      <td className="td-primary">{v.model}</td>
                      <td className="hidden md:table-cell">{v.variantName}</td>
                      <td className="hidden lg:table-cell" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {v.variantCode}
                      </td>
                      <td className="hidden xl:table-cell">{v.fuelType}</td>
                      <td className="hidden xl:table-cell">{v.transmission}</td>
                      <td style={{ fontWeight: 500 }}>
                        ₹{v.exShowroomPrice?.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div className="flex-gap-2">
                          <button
                            onClick={() => handleView(v)}
                            className="btn btn-ghost btn-icon"
                            title="View Specs"
                          >
                            <Eye style={{ width: 15, height: 15, color: '#1D4ED8' }} />
                          </button>
                          <button
                            onClick={() => handleEdit(v)}
                            className="btn btn-ghost btn-icon"
                            title="Edit Variant"
                          >
                            <Edit3 style={{ width: 15, height: 15, color: '#15803D' }} />
                          </button>
                          <button
                            onClick={() => handleDelete(v)}
                            className="btn btn-ghost btn-icon"
                            title="Delete Variant"
                          >
                            <Trash2 style={{ width: 15, height: 15, color: '#DC2626' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginatedData.content.length === 0 && (
                <div className="table-empty">
                  <p className="text-sm font-medium">No variants found in inventory</p>
                </div>
              )}
            </div>

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

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={showFormModal} 
        onClose={() => setShowFormModal(false)} 
        title={isEdit ? "Edit Variant" : "Add New Variant"}
        size="lg"
      >
        <VariantForm 
          initialData={selectedVariant}
          onSuccess={() => { setShowFormModal(false); refetch(); }}
          onCancel={() => setShowFormModal(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        title="Variant Specifications"
        size="md"
      >
        {selectedVariant && <VariantDetails variant={selectedVariant} />}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => setShowDetailsModal(false)}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => !isDeleting && setShowDeleteModal(false)} 
        title="Delete Variant"
        size="sm"
      >
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the variant <strong>{selectedVariant?.variantName}</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete the variant from the system.
          </p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 style={{ width: 16, height: 16 }} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Variants;
