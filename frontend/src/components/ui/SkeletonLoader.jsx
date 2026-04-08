/**
 * SkeletonLoader Component
 * 
 * Displays animated skeleton placeholders during loading states.
 * Provides better UX than spinners for table and list content.
 */

const SkeletonRow = ({ columns = 5 }) => {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index}>
          <div className="skeleton-box" />
        </td>
      ))}
    </tr>
  );
};

const SkeletonTable = ({ rows = 5, columns = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonRow key={index} columns={columns} />
      ))}
    </>
  );
};

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <div className="skeleton-box" style={{ width: '60%', height: '1.25rem' }} />
        <div className="skeleton-box" style={{ width: '80px', height: '1.5rem', borderRadius: '12px' }} />
      </div>
      <div className="skeleton-card-body">
        <div className="skeleton-box" style={{ width: '100%', height: '0.875rem', marginBottom: '0.5rem' }} />
        <div className="skeleton-box" style={{ width: '90%', height: '0.875rem', marginBottom: '0.5rem' }} />
        <div className="skeleton-box" style={{ width: '70%', height: '0.875rem' }} />
      </div>
      <div className="skeleton-card-footer">
        <div className="skeleton-box" style={{ width: '80px', height: '2rem', borderRadius: '6px' }} />
        <div className="skeleton-box" style={{ width: '80px', height: '2rem', borderRadius: '6px' }} />
      </div>
    </div>
  );
};

const SkeletonCards = ({ count = 3 }) => {
  return (
    <div className="mobile-view">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export { SkeletonRow, SkeletonTable, SkeletonCard, SkeletonCards };
export default SkeletonTable;
