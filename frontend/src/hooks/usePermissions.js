import { useAuth } from '../context/AuthContext';

/**
 * Permission definitions for each role
 */
const PERMISSIONS = {
  SUPER_ADMIN: {
    canViewDashboard: true,
    canViewInventory: true,
    canAddVehicle: true,
    canEditVehicle: true,
    canDeleteVehicle: true,
    canViewBookings: true,
    canCreateBooking: true,
    canEditBooking: true,
    canCancelBooking: true,
    canViewTestDrives: true,
    canScheduleTestDrive: true,
    canViewCustomers: true,
    canAddCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: true,
    canViewExchange: true,
    canCreateExchange: true,
    canApproveExchange: true,
    canViewAccessories: true,
    canAddAccessory: true,
    canEditAccessory: true,
    canDeleteAccessory: true,
    canViewVariants: true,
    canAddVariant: true,
    canEditVariant: true,
    canDeleteVariant: true,
    canViewReports: true,
    canExportReports: true,
    canViewAdminSettings: true,
    canManageUsers: true,
    canManageDealerships: true
  },
  DEALER_MANAGER: {
    canViewDashboard: true,
    canViewInventory: true,
    canAddVehicle: true,
    canEditVehicle: true,
    canDeleteVehicle: false,
    canViewBookings: true,
    canCreateBooking: true,
    canEditBooking: true,
    canCancelBooking: true,
    canViewTestDrives: true,
    canScheduleTestDrive: true,
    canViewCustomers: true,
    canAddCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: false,
    canViewExchange: true,
    canCreateExchange: true,
    canApproveExchange: true,
    canViewAccessories: true,
    canAddAccessory: true,
    canEditAccessory: true,
    canDeleteAccessory: false,
    canViewVariants: true,
    canAddVariant: false,
    canEditVariant: false,
    canDeleteVariant: false,
    canViewReports: true,
    canExportReports: true,
    canViewAdminSettings: false,
    canManageUsers: false,
    canManageDealerships: false
  },
  SALES_EXECUTIVE: {
    canViewDashboard: true,
    canViewInventory: true,
    canAddVehicle: false,
    canEditVehicle: false,
    canDeleteVehicle: false,
    canViewBookings: true,
    canCreateBooking: true,
    canEditBooking: true,
    canCancelBooking: false,
    canViewTestDrives: true,
    canScheduleTestDrive: true,
    canViewCustomers: true,
    canAddCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: false,
    canViewExchange: true,
    canCreateExchange: true,
    canApproveExchange: false,
    canViewAccessories: true,
    canAddAccessory: false,
    canEditAccessory: false,
    canDeleteAccessory: false,
    canViewVariants: false,
    canAddVariant: false,
    canEditVariant: false,
    canDeleteVariant: false,
    canViewReports: false,
    canExportReports: false,
    canViewAdminSettings: false,
    canManageUsers: false,
    canManageDealerships: false
  }
};

/**
 * Hook for checking user permissions based on role
 * 
 * @returns {Object} - Permission check functions and user role
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  const userRole = user?.role || 'SALES_EXECUTIVE';
  const permissions = PERMISSIONS[userRole] || PERMISSIONS.SALES_EXECUTIVE;

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission key (e.g., 'canAddVehicle')
   * @returns {boolean}
   */
  const can = (permission) => {
    return permissions[permission] === true;
  };

  /**
   * Check if user has any of the specified permissions
   * @param {string[]} permissionList - Array of permission keys
   * @returns {boolean}
   */
  const canAny = (permissionList) => {
    return permissionList.some(permission => permissions[permission] === true);
  };

  /**
   * Check if user has all of the specified permissions
   * @param {string[]} permissionList - Array of permission keys
   * @returns {boolean}
   */
  const canAll = (permissionList) => {
    return permissionList.every(permission => permissions[permission] === true);
  };

  return {
    can,
    canAny,
    canAll,
    permissions,
    userRole
  };
};
