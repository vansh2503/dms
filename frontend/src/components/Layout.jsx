import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Vehicle Inventory',
  '/bookings': 'Bookings',
  '/test-drives': 'Test Drives',
  '/customers': 'Customers',
  '/exchange': 'Exchange',
  '/accessories': 'Accessories',
  '/variants': 'Variants',
  '/reports': 'Reports & Analytics',
  '/admin': 'Admin Settings',
};

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Hyundai DMS';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':    return 'badge badge-purple';
      case 'DEALER_MANAGER': return 'badge badge-info';
      case 'SALES_EXECUTIVE': return 'badge badge-success';
      case 'SENIOR_OFFICIAL': return 'badge badge-warning';
      default: return 'badge badge-default';
    }
  };

  const formatRole = (role) =>
    role?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || 'User';

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        {/* Top Bar */}
        <header className="app-topbar">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="btn btn-ghost btn-icon sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
            </button>
            <h1 className="text-sm font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#002C5F' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {user?.name || 'User'}
                </p>
                <span className={getRoleBadgeClass(user?.role)}>
                  {formatRole(user?.role)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
