import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exchangeService } from '../services/exchangeService';
import { useAuth } from '../context/AuthContext';
import { Plus, Eye, CheckCircle, XCircle, ClipboardList, Filter, X, Search, List, Grid } from 'lucide-react';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import SearchBar from '../components/ui/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import ExchangeDetailsModal from '../components/exchange/ExchangeDetailsModal';
import EvaluateExchangeModal from '../components/exchange/EvaluateExchangeModal';
import NewExchangeForm from '../components/exchange/NewExchangeForm';
import MobileCard from '../components/ui/MobileCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { SkeletonTable, SkeletonCards } from '../components/ui/SkeletonLoader';

const STATUSES = ['PENDING', 'EVALUATED', 'APPROVED', 'REJECTED', 'COMPLETED'];

const Exchange = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isManager = user?.role === 'SUPER_ADMIN' || user?.role === 'DEALER_MANAGER';

  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [toast, setToast] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [exchangeToUpdate, setExchangeToUpdate] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    vehicleId: '',
    fromDate: '',
    toDate: '',
  });

  // View mode state
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: exchangesData, isLoading } = useQuery({
    queryKey: ['exchanges', filters],
    queryFn: () => exchangeService.getAllExchangeRequests(filters),
  });

  const paginatedData = useMemo(() => {
    let all = exchangesData?.data || [];
    const totalElements = all.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const safePage = Math.min(page, totalPages - 1);
    return {
      content: all.slice(safePage * pageSize, safePage * pageSize + pageSize),
      totalElements,
      totalPages,
    };
  }, [exchangesData, page, pageSize]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => exchangeService.updateStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries(['exchanges']);
      showToast(`Exchange ${status.toLowerCase()} successfully`);
      setShowStatusConfirm(false);
      setExchangeToUpdate(null);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Action failed');
      setShowStatusConfirm(false);
      setExchangeToUpdate(null);
    },
  });

  const handleStatusAction = (exchange, status) => {
    setExchangeToUpdate({ exchange, status });
    setShowStatusConfirm(true);
  };

  const confirmStatusUpdate = () => {
    if (exchangeToUpdate) {
      statusMutation.mutate({ 
        id: exchangeToUpdate.exchange.exchangeId, 
        status: exchangeToUpdate.status 
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', vehicleId: '', fromDate: '', toDate: '' });
    setPage(0);
  };

  const handleView = (exchange) => { setSelectedExchange(exchange); setShowDetailsModal(true); };
  const handleEvaluate = (exchange) => { setSelectedExchange(exchange); setShowEvaluateModal(true); };
  
  const activeFilterCount = [
    filters.status,
    filters.vehicleId,
    filters.fromDate,
    filters.toDate,
  ].filter(Boolean).length;
  
  const fmt = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          backgroundColor: '#15803D', color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 8,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      <PageHeader title="Vehicle Exchange" subtitle={`${paginatedData.totalElements} exchange requests`}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary btn-sm"
          style={{ position: 'relative' }}
        >
          <Filter style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6, width: 16, height: 16,
              borderRadius: '50%', backgroundColor: '#002C5F', color: '#fff',
              fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{activeFilterCount}</span>
          )}
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNewModal(true)}>
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">New Request</span>
        </button>
      </PageHeader>

      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search by customer, vehicle, registration..."
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
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

        {showFilters && (
          <div style={{
            backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: 8, padding: '1rem', marginBottom: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
            alignItems: 'end',
          }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Request From Date</label>
              <input type="date" className="input-field" value={filters.fromDate} onChange={(e) => handleFilterChange('fromDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Request To Date</label>
              <input type="date" className="input-field" value={filters.toDate} onChange={(e) => handleFilterChange('toDate', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <X style={{ width: 13, height: 13 }} /> Clear
              </button>
            </div>
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
                    <th>Customer</th>
                    <th className="hidden md:table-cell">Old Vehicle</th>
                    <th className="hidden lg:table-cell">New Vehicle</th>
                    <th className="hidden lg:table-cell">Valuation</th>
                    <th className="hidden xl:table-cell">Offered</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <SkeletonTable rows={5} columns={7} />
                </tbody>
              </table>
            </div>
          )
        ) : paginatedData.content.length === 0 ? (
          <div className="table-empty">
            <Search style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 0.5rem' }} />
            <p className="text-sm font-medium">No exchange requests found</p>
            {activeFilterCount > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'card' || isMobile ? (
              <div className="mobile-view fade-in">
                {paginatedData.content.map((exchange) => (
                  <MobileCard
                    key={exchange.exchangeId}
                    fields={[
                      { label: 'Customer', value: exchange.customerName },
                      { 
                        label: 'Old Vehicle', 
                        value: `${exchange.oldVehicleMake} ${exchange.oldVehicleModel} (${exchange.oldVehicleYear})`
                      },
                      { label: 'Registration', value: exchange.oldVehicleRegistration },
                      { label: 'New Vehicle', value: exchange.newVehicleModel || '—' },
                      { 
                        label: 'Valuation', 
                        value: exchange.valuationAmount,
                        render: () => fmt(exchange.valuationAmount)
                      },
                      { 
                        label: 'Offered', 
                        value: exchange.offeredAmount,
                        render: () => fmt(exchange.offeredAmount)
                      },
                      { 
                        label: 'Status', 
                        render: () => <StatusBadge status={exchange.status} />
                      }
                    ]}
                    actions={
                      <>
                        <button onClick={() => handleView(exchange)} className="btn btn-sm btn-secondary">
                          <Eye style={{ width: 14, height: 14 }} />
                          View
                        </button>
                        {isManager && exchange.status === 'PENDING' && (
                          <button onClick={() => handleEvaluate(exchange)} className="btn btn-sm btn-primary">
                            <ClipboardList style={{ width: 14, height: 14 }} />
                            Evaluate
                          </button>
                        )}
                        {isManager && exchange.status === 'EVALUATED' && (
                          <button onClick={() => handleStatusAction(exchange, 'APPROVED')} className="btn btn-sm btn-success" disabled={statusMutation.isPending}>
                            <CheckCircle style={{ width: 14, height: 14 }} />
                            Approve
                          </button>
                        )}
                        {isManager && (exchange.status === 'PENDING' || exchange.status === 'EVALUATED') && (
                          <button onClick={() => handleStatusAction(exchange, 'REJECTED')} className="btn btn-sm btn-danger" disabled={statusMutation.isPending}>
                            <XCircle style={{ width: 14, height: 14 }} />
                            Reject
                          </button>
                        )}
                        {isManager && exchange.status === 'APPROVED' && (
                          <button onClick={() => handleStatusAction(exchange, 'COMPLETED')} className="btn btn-sm btn-primary" disabled={statusMutation.isPending}>
                            <CheckCircle style={{ width: 14, height: 14 }} />
                            Complete
                          </button>
                        )}
                      </>
                    }
                    onClick={() => handleView(exchange)}
                  />
                ))}
              </div>
            ) : (
              <div className="table-wrapper fade-in">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th className="hidden md:table-cell">Old Vehicle</th>
                      <th className="hidden lg:table-cell">New Vehicle</th>
                      <th className="hidden lg:table-cell">Valuation</th>
                      <th className="hidden xl:table-cell">Offered</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.content.map((exchange) => (
                      <tr key={exchange.exchangeId}>
                        <td className="td-primary">{exchange.customerName}</td>
                        <td className="hidden md:table-cell">
                          {exchange.oldVehicleMake} {exchange.oldVehicleModel}
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: 4 }}>
                            ({exchange.oldVehicleYear})
                          </span>
                        </td>
                        <td className="hidden lg:table-cell">{exchange.newVehicleModel || '—'}</td>
                        <td className="hidden lg:table-cell" style={{ fontWeight: 500 }}>{fmt(exchange.valuationAmount)}</td>
                        <td className="hidden xl:table-cell" style={{ fontWeight: 500 }}>{fmt(exchange.offeredAmount)}</td>
                        <td><StatusBadge status={exchange.status} /></td>
                        <td>
                          <div className="flex-gap-2">
                            <button onClick={() => handleView(exchange)} className="btn btn-ghost btn-icon" title="View Details">
                              <Eye style={{ width: 15, height: 15, color: '#1D4ED8' }} />
                            </button>
                            {isManager && exchange.status === 'PENDING' && (
                              <button onClick={() => handleEvaluate(exchange)} className="btn btn-ghost btn-icon" title="Evaluate">
                                <ClipboardList style={{ width: 15, height: 15, color: '#D97706' }} />
                              </button>
                            )}
                            {isManager && exchange.status === 'EVALUATED' && (
                              <button onClick={() => handleStatusAction(exchange, 'APPROVED')} className="btn btn-ghost btn-icon" title="Approve" disabled={statusMutation.isPending}>
                                <CheckCircle style={{ width: 15, height: 15, color: '#15803D' }} />
                              </button>
                            )}
                            {isManager && (exchange.status === 'PENDING' || exchange.status === 'EVALUATED') && (
                              <button onClick={() => handleStatusAction(exchange, 'REJECTED')} className="btn btn-ghost btn-icon" title="Reject" disabled={statusMutation.isPending}>
                                <XCircle style={{ width: 15, height: 15, color: '#DC2626' }} />
                              </button>
                            )}
                            {isManager && exchange.status === 'APPROVED' && (
                              <button onClick={() => handleStatusAction(exchange, 'COMPLETED')} className="btn btn-ghost btn-icon" title="Mark Completed" disabled={statusMutation.isPending}>
                                <CheckCircle style={{ width: 15, height: 15, color: '#002C5F' }} />
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
            {paginatedData.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={paginatedData.totalPages}
                totalElements={paginatedData.totalElements}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(0); }}
              />
            )}
          </>
        )}
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="New Exchange Request" size="lg">
        <NewExchangeForm
          onSuccess={(msg) => { setShowNewModal(false); showToast(msg); }}
          onCancel={() => setShowNewModal(false)}
        />
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedExchange(null); }} title="Exchange Request Details" size="md">
        <ExchangeDetailsModal exchange={selectedExchange} />
      </Modal>

      <Modal isOpen={showEvaluateModal} onClose={() => { setShowEvaluateModal(false); setSelectedExchange(null); }} title="Evaluate Exchange" size="sm">
        <EvaluateExchangeModal
          exchange={selectedExchange}
          onSuccess={(msg) => { setShowEvaluateModal(false); setSelectedExchange(null); showToast(msg); }}
          onCancel={() => { setShowEvaluateModal(false); setSelectedExchange(null); }}
        />
      </Modal>

      {/* Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => {
          setShowStatusConfirm(false);
          setExchangeToUpdate(null);
        }}
        onConfirm={confirmStatusUpdate}
        title={
          exchangeToUpdate?.status === 'APPROVED' ? 'Approve Exchange' :
          exchangeToUpdate?.status === 'REJECTED' ? 'Reject Exchange' :
          'Complete Exchange'
        }
        message={
          exchangeToUpdate?.status === 'APPROVED' 
            ? `Are you sure you want to approve this exchange request for ${exchangeToUpdate?.exchange?.customerName}?`
            : exchangeToUpdate?.status === 'REJECTED'
            ? `Are you sure you want to reject this exchange request for ${exchangeToUpdate?.exchange?.customerName}? This action cannot be undone.`
            : `Are you sure you want to mark this exchange as completed for ${exchangeToUpdate?.exchange?.customerName}?`
        }
        confirmText={
          exchangeToUpdate?.status === 'APPROVED' ? 'Approve' :
          exchangeToUpdate?.status === 'REJECTED' ? 'Reject' :
          'Complete'
        }
        variant={exchangeToUpdate?.status === 'REJECTED' ? 'danger' : 'primary'}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default Exchange;
