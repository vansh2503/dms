import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, UserX, UserCheck, Filter, X, User, Mail, Phone, Lock, Shield, Building } from 'lucide-react';
import Modal from '../Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import PageHeader from '../ui/PageHeader';
import SearchBar from '../ui/SearchBar';
import { StatusBadge } from '../ui/Badge';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import { SkeletonTable } from '../ui/SkeletonLoader';
import FormField from '../FormField';

const UserManagementTab = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminService.getAllUsers()
  });

  const { data: dealershipsResponse } = useQuery({
    queryKey: ['dealerships'],
    queryFn: () => adminService.getAllDealerships()
  });

  const users = usersResponse?.data || [];
  const dealerships = dealershipsResponse?.data || [];

  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search ||
      user.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.phone?.includes(filters.search);

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status ||
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => selectedUser
      ? adminService.updateUser(selectedUser.userId, data)
      : adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowAddModal(false);
      reset();
      setSelectedUser(null);
      setToast(selectedUser ? 'User updated successfully' : 'User created successfully');
      setTimeout(() => setToast(''), 3000);
    },
    onError: (err) => {
      setToast(getErrorMessage(err));
      setTimeout(() => setToast(''), 3000);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (userId) => adminService.toggleUserStatus(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['users']);
      setToast(`User ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setToast(''), 3000);
    },
    onError: (err) => {
      setToast(getErrorMessage(err));
      setTimeout(() => setToast(''), 3000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setToast('User deleted successfully');
      setTimeout(() => setToast(''), 3000);
    },
    onError: (err) => {
      setToast(getErrorMessage(err));
      setTimeout(() => setToast(''), 3000);
    }
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      dealershipId: data.dealershipId ? Number(data.dealershipId) : null,
      phone: data.phone?.trim() || null
    };
    mutation.mutate(formattedData);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowAddModal(true);
    reset({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      dealershipId: user.dealershipId
    });
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.userId);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const roles = ['SUPER_ADMIN', 'DEALER_MANAGER', 'SALES_EXECUTIVE'];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', role: '', status: '' });
  };

  const activeFilterCount = [filters.role, filters.status].filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          backgroundColor: toast.includes('success') || toast.includes('activated') || toast.includes('deactivated') || toast.includes('deleted') || toast.includes('created') || toast.includes('updated') ? '#15803D' : '#DC2626',
          color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 8,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      <PageHeader
        title="User Management"
        subtitle={`${filteredUsers.length} of ${users.length} staff members`}
      >
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowAddModal(true);
            reset({
              username: '', email: '', fullName: '', phone: '', role: 'SALES_EXECUTIVE', dealershipId: ''
            });
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add User</span>
        </button>
      </PageHeader>

      <div className="card" style={{ padding: '1rem' }}>
        {/* Search + Filter */}
        <div className="flex-between" style={{ marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search by name, email, or phone..."
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative' }}
          >
            <Filter style={{ width: 14, height: 14 }} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#002C5F',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.75rem',
                alignItems: 'end',
              }}
            >
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)}>
                  <option value="">All Roles</option>
                  {roles.map(role => <option key={role} value={role}>{role.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                  <option value="">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <X style={{ width: 13, height: 13 }} /> Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="hidden md:table-cell">Email</th>
                  <th className="hidden lg:table-cell">Phone</th>
                  <th>Role</th>
                  <th className="hidden lg:table-cell">Dealership</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <SkeletonTable rows={5} columns={7} />
              </tbody>
            </table>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="table-empty">
            <p className="text-sm font-medium">No users found</p>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="table-wrapper fade-in">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="hidden md:table-cell">Email</th>
                  <th className="hidden lg:table-cell">Phone</th>
                  <th>Role</th>
                  <th className="hidden lg:table-cell">Dealership</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td className="td-primary">{user.fullName}</td>
                    <td className="hidden md:table-cell">{user.email}</td>
                    <td className="hidden lg:table-cell">{user.phone || '—'}</td>
                    <td>{user.role.replace('_', ' ')}</td>
                    <td className="hidden lg:table-cell">
                      {dealerships.find(d => d.dealershipId === user.dealershipId)?.dealershipName || '—'}
                    </td>
                    <td>
                      <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td>
                      <div className="flex-gap-2">
                        <button onClick={() => handleEdit(user)} className="btn btn-ghost btn-icon" title="Edit">
                          <Edit style={{ width: 15, height: 15, color: '#15803D' }} />
                        </button>
                        <button
                          onClick={() => toggleMutation.mutate(user.userId)}
                          className="btn btn-ghost btn-icon"
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          disabled={mutation.isPending || toggleMutation.isPending || deleteMutation.isPending}
                        >
                          {user.isActive ? (
                            <UserX style={{ width: 15, height: 15, color: '#F59E0B' }} />
                          ) : (
                            <UserCheck style={{ width: 15, height: 15, color: '#15803D' }} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="btn btn-ghost btn-icon"
                          title="Delete"
                          disabled={mutation.isPending || toggleMutation.isPending || deleteMutation.isPending}
                        >
                          <Trash2 style={{ width: 15, height: 15, color: '#DC2626' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedUser(null); reset(); }}
        title={selectedUser ? 'Edit User Profile' : 'Register New Staff Member'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
              <FormField
                label="Full Name"
                name="fullName"
                required
                register={register}
                error={errors.fullName?.message}
                placeholder="Manager/Executive name"
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <FormField
              label="Username"
              name="username"
              required
              register={register}
              error={errors.username?.message}
              placeholder="Unique username"
              icon={<Shield className="w-4 h-4" />}
            />

            <FormField
              label="Phone Number"
              name="phone"
              register={register}
              error={errors.phone?.message}
              placeholder="09876543210"
              icon={<Phone className="w-4 h-4" />}
            />

            <div className="md:col-span-2">
              <FormField
                label="Email Address"
                name="email"
                type="email"
                required
                register={register}
                error={errors.email?.message}
                placeholder="name@hyundai.in"
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            {!selectedUser && (
              <div className="md:col-span-2">
                <FormField
                  label="Initial Password"
                  name="password"
                  type="password"
                  required
                  register={register}
                  error={errors.password?.message}
                  icon={<Lock className="w-4 h-4" />}
                  hint="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                />
              </div>
            )}

            <div>
              <label className="form-label">System Role <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Shield className="w-4 h-4" />
                </div>
                <select {...register('role', { required: 'Role is required' })} className="form-select pl-10" defaultValue="SALES_EXECUTIVE">
                  {roles.map(role => <option key={role} value={role}>{role.replace('_', ' ')}</option>)}
                </select>
              </div>
              {errors.role && <p className="form-error">{errors.role.message}</p>}
            </div>

            <div>
              <label className="form-label">Assigned Dealership</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Building className="w-4 h-4" />
                </div>
                <select {...register('dealershipId')} className="form-select pl-10">
                  <option value="">Select Dealership</option>
                  {dealerships.map(d => <option key={d.dealershipId} value={d.dealershipId}>{d.dealershipName}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => { setShowAddModal(false); reset(); }} 
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending} 
              className="btn btn-primary px-10 py-3 shadow-lg shadow-blue-100"
            >
              {mutation.isPending && <span className="spinner spinner-sm" />}
              {mutation.isPending ? 'Processing...' : selectedUser ? 'Save Updates' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${userToDelete?.fullName}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete User"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default UserManagementTab;
