/**
 * PageHeader — consistent page-level header component
 *
 * Props:
 *   title: string
 *   subtitle?: string
 *   children?: ReactNode  (action buttons go here)
 */
const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children && (
        <div className="page-actions">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
