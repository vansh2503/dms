/**
 * Pagination Component
 * 
 * Props:
 *   currentPage: number (0-indexed)
 *   totalPages: number
 *   totalElements: number
 *   pageSize: number
 *   onPageChange: (page: number) => void
 *   onPageSizeChange: (size: number) => void
 */
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  totalElements = 0,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Info */}
      <div className="pagination-info">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalElements}</span> results
      </div>

      {/* Controls */}
      <div className="pagination-controls">
        {/* Page Size Selector */}
        <div className="pagination-size-selector">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="form-select"
            style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', fontSize: '0.875rem' }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="pagination-buttons">
          {/* First Page */}
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            className="pagination-btn"
            title="First Page"
          >
            <ChevronsLeft style={{ width: 16, height: 16 }} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="pagination-btn"
            title="Previous Page"
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page + 1}
              </button>
            )
          ))}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="pagination-btn"
            title="Next Page"
          >
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className="pagination-btn"
            title="Last Page"
          >
            <ChevronsRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
