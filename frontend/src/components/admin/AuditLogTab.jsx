import { useState, useMemo } from 'react';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import PageHeader from '../ui/PageHeader';
import SearchBar from '../ui/SearchBar';
import { StatusBadge } from '../ui/Badge';
import { SkeletonTable } from '../ui/SkeletonLoader';
import Pagination from '../Pagination';
import { format } from 'date-fns';

const AuditLogTab = () => {
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    fromDate: '',
    toDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['auditLogs', filters, page, pageSize],
    queryFn: () => adminService.getAuditLogs({ ...filters, page, size: pageSize })
  });

  // Handle both paginated and non-paginated responses
  const auditLogs = response?.data?.content || response?.data || [];
  const totalElements = response?.data?.totalElements || auditLogs.length;
  const totalPages = response?.data?.totalPages || Math.ceil(auditLogs.length / pageSize);
  
  // Client-side filtering for search (if backend doesn't support it)
  const filteredLogs = useMemo(() => {
    if (!filters.search) return auditLogs;
    const searchLower = filters.search.toLowerCase();
    return auditLogs.filter(log => 
      log.action?.toLowerCase().includes(searchLower) ||
      log.details?.toLowerCase().includes(searchLower) ||
      log.performedBy?.toLowerCase().includes(searchLower)
    );
  }, [auditLogs, filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ search: '', action: '', fromDate: '', toDate: '' });
    setPage(0);
  };
  
  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  const getActionBadgeStatus = (action) => {
    const actionUpper = action?.toUpperCase() || '';
    if (actionUpper.includes('CREATE')) return 'CONFIRMED';
    if (actionUpper.includes('UPDATE')) return 'IN_SHOWROOM';
    if (actionUpper.includes('DELETE')) return 'CANCELLED';
    if (actionUpper.includes('CANCEL')) return 'PENDING';
    return 'ACTIVE';
  };

  const activeFilterCount = [filters.action, filters.fromDate, filters.toDate].filter(Boolean).length;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PageHeader title="System Audit Trail" subtitle="Loading audit logs..." />
        <div className="card" style={{ padding: '1rem' }}>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Operator</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <SkeletonTable rows={5} columns={4} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PageHeader title="System Audit Trail" subtitle="Error loading logs" />
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#DC2626' }}>
          {getErrorMessage(error)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="System Audit Trail"
        subtitle={`${auditLogs.length} activity records`}
      />

      <div className="card" style={{ padding: '1rem' }}>
        {/* Search + Filter */}
        <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search logs by action or details..."
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
                <label className="form-label">Action Type</label>
                <select className="form-select" value={filters.action} onChange={(e) => handleFilterChange('action', e.target.value)}>
                  <option value="">All Actions</option>
                  <option value="CREATE">Creation</option>
                  <option value="UPDATE">Updates</option>
                  <option value="DELETE">Deletions</option>
                  <option value="CANCEL">Cancellations</option>
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

        {/* Table */}
        {auditLogs.length === 0 ? (
          <div className="table-empty">
            <p className="text-sm font-medium">No activity logs found</p>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
              {filters.search || filters.action || filters.fromDate || filters.toDate
                ? 'Try adjusting your filters'
                : 'System activity will appear here'}
            </p>
          </div>
        ) : (
          <div className="table-wrapper fade-in">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th className="hidden md:table-cell">Operator</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <>
                    <tr 
                      key={log.auditLogId}
                      onClick={() => setExpandedRow(expandedRow === log.auditLogId ? null : log.auditLogId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                      </td>
                      <td className="hidden md:table-cell">{log.performedBy}</td>
                      <td>
                        <StatusBadge status={getActionBadgeStatus(log.action)} />
                      </td>
                      <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.details}
                      </td>
                      <td>
                        {expandedRow === log.auditLogId ? (
                          <ChevronDown style={{ width: 16, height: 16, color: '#94a3b8' }} />
                        ) : (
                          <ChevronRight style={{ width: 16, height: 16, color: '#94a3b8' }} />
                        )}
                      </td>
                    </tr>
                    {expandedRow === log.auditLogId && (
                      <tr key={`${log.auditLogId}-expanded`}>
                        <td colSpan="5" style={{ backgroundColor: '#F8FAFC', padding: '1rem' }}>
                          <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '1rem',
                            border: '1px solid #E2E8F0'
                          }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                              Full Details
                            </p>
                            <pre style={{
                              fontSize: '0.75rem',
                              color: '#1e293b',
                              fontFamily: 'monospace',
                              backgroundColor: '#F8FAFC',
                              padding: '0.75rem',
                              borderRadius: '6px',
                              lineHeight: '1.5',
                              overflow: 'auto',
                              border: '1px solid #E2E8F0'
                            }}>
                              {JSON.stringify({ 
                                id: log.auditLogId,
                                timestamp: log.timestamp,
                                operator: log.performedBy,
                                action: log.action,
                                details: log.details
                              }, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogTab;
