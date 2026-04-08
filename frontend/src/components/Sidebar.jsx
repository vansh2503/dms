import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import {
  LayoutDashboard,
  Car,
  BookOpen,
  TestTube,
  Users,
  RefreshCw,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard',  label: 'Dashboard',      icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE', 'SENIOR_OFFICIAL'] },
  { path: '/inventory',  label: 'Inventory',       icon: Car,             roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/bookings',   label: 'Bookings',        icon: BookOpen,        roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/test-drives',label: 'Test Drives',     icon: TestTube,        roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/customers',  label: 'Customers',       icon: Users,           roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/exchange',   label: 'Exchange',        icon: RefreshCw,       roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/accessories',label: 'Accessories',     icon: Package,         roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/variants',   label: 'Variants',        icon: Layers,          roles: ['SUPER_ADMIN', 'DEALER_MANAGER'] },
  { path: '/reports',    label: 'Sales Reports',   icon: BarChart3,       roles: ['SUPER_ADMIN', 'DEALER_MANAGER', 'SENIOR_OFFICIAL'] },
  { path: '/admin',      label: 'Admin Settings',  icon: Settings,        roles: ['SUPER_ADMIN'] },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const formatRole = (role) =>
    role?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || 'User';

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className={`app-sidebar${open ? ' open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <Car className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <span className="sidebar-brand-text">HYUNDAI</span>
          <span className="sidebar-brand-sub">Dealer Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item${active ? ' active' : ''}`}
              onClick={onClose}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — User info + Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="sidebar-user-name truncate">
              {user?.name || 'User'}
            </p>
            <p className="sidebar-user-role truncate">
              {formatRole(user?.role)}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogoutClick}
          className="nav-item w-full"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <LogOut style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        title="Sign Out"
        size="sm"
      >
        <div className="py-2">
          {/* Icon and Message */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              {/* Animated background circles */}
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border-2 border-red-100 shadow-lg">
                <LogOut className="w-7 h-7 text-red-600" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Are you sure you want to sign out?
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              You will be logged out of your account and redirected to the login page.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleLogoutCancel}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleLogoutConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};

export default Sidebar;
