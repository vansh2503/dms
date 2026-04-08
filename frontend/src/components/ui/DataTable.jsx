import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * DataTable - Reusable responsive data table component
 * 
 * @param {Array} columns - Column definitions: [{ key, label, render, sortable, responsive }]
 * @param {Array} data - Data array
 * @param {function} onRowClick - Optional row click handler
 * @param {string} emptyMessage - Message when no data
 * @param {boolean} loading - Loading state
 * @param {string} keyField - Field to use as row key (default: 'id')
 */
const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  keyField = 'id'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!columns.find(col => col.key === key)?.sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    
    const comparison = aVal < bVal ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="table-wrapper">
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.responsive ? `hidden ${col.responsive}:table-cell` : ''}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {col.label}
                  {col.sortable && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' ? 
                      <ChevronUp style={{ width: 12, height: 12 }} /> : 
                      <ChevronDown style={{ width: 12, height: 12 }} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={row[keyField]}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={col.responsive ? `hidden ${col.responsive}:table-cell` : ''}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
