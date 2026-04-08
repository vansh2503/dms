import { usePermissions } from '../../hooks/usePermissions';

/**
 * ProtectedAction Component - Conditionally render children based on permissions
 * 
 * @param {string} permission - Permission key to check (e.g., 'canAddVehicle')
 * @param {string[]} permissions - Array of permission keys (any match)
 * @param {ReactNode} children - Content to render if permitted
 * @param {ReactNode} fallback - Content to render if not permitted (optional)
 * @param {boolean} hide - If true, hide completely; if false, show disabled (default: true)
 */
const ProtectedAction = ({
  permission,
  permissions,
  children,
  fallback = null,
  hide = true
}) => {
  const { can, canAny } = usePermissions();

  // Check single permission
  if (permission && !can(permission)) {
    return hide ? fallback : children;
  }

  // Check multiple permissions (any match)
  if (permissions && !canAny(permissions)) {
    return hide ? fallback : children;
  }

  return children;
};

export default ProtectedAction;
