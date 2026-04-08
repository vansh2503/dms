import { useState } from 'react';
import { Users, Building2, Settings as SettingsIcon, FileText, Shield } from 'lucide-react';
import UserManagementTab from '../components/admin/UserManagementTab';
import DealershipManagementTab from '../components/admin/DealershipManagementTab';
import SystemSettingsTab from '../components/admin/SystemSettingsTab';
import AuditLogTab from '../components/admin/AuditLogTab';
import PageHeader from '../components/ui/PageHeader';

const tabs = [
  { id: 'users',        label: 'User Management',  icon: Users },
  { id: 'dealerships',  label: 'Dealerships',       icon: Building2 },
  { id: 'settings',     label: 'System Settings',   icon: SettingsIcon },
  { id: 'audit',        label: 'Audit Log',         icon: FileText },
];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Admin Settings"
          subtitle="System administration and configuration"
        />
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Shield className="w-4 h-4 text-hyundai-blue" />
          <span className="text-xs font-bold text-gray-700">ADMIN PANEL</span>
        </div>
      </div>

      <div className="card shadow-lg" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0 1.5rem', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)' }} className="tabs-bar border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  transition: 'all 0.2s ease',
                  transform: activeTab === tab.id ? 'translateY(-2px)' : 'none'
                }}
              >
                <Icon style={{ width: 16, height: 16 }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '2rem', minHeight: '500px' }}>
          {activeTab === 'users'       && <UserManagementTab />}
          {activeTab === 'dealerships' && <DealershipManagementTab />}
          {activeTab === 'settings'    && <SystemSettingsTab />}
          {activeTab === 'audit'       && <AuditLogTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
