/**
 * Badge — reusable status/label badge
 *
 * Props:
 *   variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'purple' | 'primary'
 *   children: ReactNode
 *   className?: string
 */
const Badge = ({ variant = 'default', children, className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

/**
 * StatusBadge — maps common status strings to the right color variant
 *
 * Props:
 *   status: string  (e.g. 'DELIVERED', 'CANCELLED', 'PENDING', 'IN_STOCK', etc.)
 */
const STATUS_MAP = {
  // Bookings
  COMPLETED:    'success',
  CONFIRMED:    'info',
  PENDING:      'warning',
  CANCELLED:    'danger',
  // Inventory
  IN_SHOWROOM:  'success',
  IN_STOCKYARD: 'info',
  IN_TRANSIT:   'warning',
  BOOKED:       'purple',
  DISPATCHED:   'default',
  SOLD:         'primary',
  // Test drives
  COMPLETED:    'success',
  SCHEDULED:    'info',
  // Generic
  ACTIVE:       'success',
  INACTIVE:     'danger',
};

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const variant = STATUS_MAP[status] || 'default';
  const label = status.replace(/_/g, ' ');
  return <Badge variant={variant}>{label}</Badge>;
};

export default Badge;
