import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { accessoryService } from '../services/accessoryService';
import { Plus, Package, Eye, Edit3, Filter, X } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/Modal';
import AccessoryForm from '../components/accessories/AccessoryForm';
import AccessoryDetails from '../components/accessories/AccessoryDetails';

const categories = ['Interior', 'Exterior', 'Electronics', 'Safety', 'Comfort', 'Performance'];

const Accessories = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12); // 12 fits nicely in a grid
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const { data: accessories, isLoading, error, refetch } = useQuery({
    queryKey: ['accessories', filters],
    queryFn: () => accessoryService.getAllAccessories(filters),
  });

  // Client-side pagination
  const paginatedData = useMemo(() => {
    const all = accessories?.data || [];
    const startIndex = page * pageSize;
    return {
      content: all.slice(startIndex, startIndex + pageSize),
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  }, [accessories, page, pageSize]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '' });
    setPage(0);
  };

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const handleAdd = () => { setSelectedAccessory(null); setIsEdit(false); setShowFormModal(true); };
  const handleEdit = (a) => { setSelectedAccessory(a); setIsEdit(true); setShowFormModal(true); };
  const handleView = (a) => { setSelectedAccessory(a); setShowDetailsModal(true); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="Accessories"
        subtitle={`${paginatedData.totalElements} accessories`}
      >
        <button onClick={handleAdd} className="btn btn-primary btn-sm">
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add Accessory</span>
        </button>
      </PageHeader>

      {isLoading ? (
        <Loading message="Loading accessories..." />
      ) : error ? (
        <ErrorMessage message={error.message || 'Failed to load accessories'} onRetry={refetch} />
      ) : (
        <div className="card" style={{ padding: '1rem' }}>
          {/* Search + Filter Bar */}
          <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <SearchBar
              value={filters.search}
              onChange={(val) => handleFilterChange('search', val)}
              placeholder="Search by name or category..."
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
                <label className="form-label">Category</label>
                <select 
                  className="form-select" 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Price (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="0"
                  value={filters.minPrice} 
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="999999"
                  value={filters.maxPrice} 
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)} 
                />
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

          {/* Accessories Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {paginatedData.content.map((accessory) => (
              <div key={accessory.id} className="card card-hover" style={{ padding: '1.25rem' }}>
                <div className="flex justify-between items-start mb-3">
                  <div
                    style={{
                      width: 38, height: 38,
                      backgroundColor: '#EFF6FF',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Package style={{ width: 18, height: 18, color: '#1D4ED8' }} />
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    {accessory.accessoryCode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
                  {accessory.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {accessory.category || 'Uncategorized'}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-black" style={{ color: '#002C5F' }}>
                    ₹{accessory.price?.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 italic">
                  {accessory.stockQuantity} in stock
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(accessory)}
                    className="btn btn-ghost btn-sm border border-gray-100 flex-1 justify-center py-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(accessory)}
                    className="btn btn-ghost btn-sm border border-gray-100 flex-1 justify-center py-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </button>
                </div>
              </div>
            ))}

            {paginatedData.content.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#94A3B8' }}>
                <Package style={{ width: 44, height: 44, margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>No accessories found in inventory</p>
                <button onClick={handleAdd} className="mt-4 text-sm font-bold hover:underline" style={{ color: '#002C5F' }}>
                  + Add your first accessory
                </button>
              </div>
            )}
          </div>

          {paginatedData.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={paginatedData.totalPages}
              totalElements={paginatedData.totalElements}
              pageSize={pageSize}
              pageSizeOptions={[12, 24, 48]}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(0); }}
            />
          )}
        </div>
      )}

      {/* Form Modal (Add/Edit) */}
      <Modal 
        isOpen={showFormModal} 
        onClose={() => setShowFormModal(false)} 
        title={isEdit ? "Edit Accessory" : "Add New Accessory"}
        size="md"
      >
        <AccessoryForm 
          initialData={selectedAccessory}
          onSuccess={() => { setShowFormModal(false); refetch(); }}
          onCancel={() => setShowFormModal(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        title="Accessory Information"
        size="sm"
      >
        {selectedAccessory && <AccessoryDetails accessory={selectedAccessory} />}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setShowDetailsModal(false)}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold"
          >
            Close
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default Accessories;
