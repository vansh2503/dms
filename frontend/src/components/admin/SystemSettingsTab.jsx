import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import PageHeader from '../ui/PageHeader';
import { SkeletonTable } from '../ui/SkeletonLoader';

const SystemSettingsTab = () => {
  const queryClient = useQueryClient();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toast, setToast] = useState('');
  
  const { data: response, isLoading, error: queryError } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => adminService.getSystemSettings()
  });

  const settingsMap = response?.data || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm();

  useEffect(() => {
    if (response?.data) {
      reset(response.data);
      setHasUnsavedChanges(false);
    }
  }, [response, reset]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const mutation = useMutation({
    mutationFn: (data) => adminService.updateSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['systemSettings']);
      setHasUnsavedChanges(false);
      setToast('Configuration updated successfully');
      setTimeout(() => setToast(''), 3000);
    },
    onError: (err) => {
      setToast(getErrorMessage(err));
      setTimeout(() => setToast(''), 3000);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PageHeader title="System Configuration" subtitle="Loading settings..." />
        <div className="card" style={{ padding: '2rem' }}>
          <SkeletonTable rows={5} columns={2} />
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PageHeader title="System Configuration" subtitle="Error loading settings" />
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#DC2626' }}>
          {getErrorMessage(queryError)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          backgroundColor: toast.includes('success') || toast.includes('updated') ? '#15803D' : '#DC2626',
          color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 8,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      <PageHeader
        title="System Configuration"
        subtitle="Manage global business rules and automation"
      >
        {hasUnsavedChanges && (
          <span className="badge badge-warning">Unsaved Changes</span>
        )}
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Financial & Booking Rules */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
            Financial & Booking Rules
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Cancellation Charge (%)</label>
              <input
                type="number"
                {...register('cancellationChargePercent', { 
                  required: true,
                  min: { value: 0, message: 'Must be at least 0' },
                  max: { value: 100, message: 'Must be at most 100' }
                })}
                className="input-field"
              />
              {errors.cancellationChargePercent && (
                <p className="text-red-500 text-xs mt-1">{errors.cancellationChargePercent.message}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                Deducted from refund when customer cancels
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Required Advance (%)</label>
              <input
                type="number"
                {...register('defaultAdvancePercent', { 
                  required: true,
                  min: { value: 0, message: 'Must be at least 0' },
                  max: { value: 100, message: 'Must be at most 100' }
                })}
                className="input-field"
              />
              {errors.defaultAdvancePercent && (
                <p className="text-red-500 text-xs mt-1">{errors.defaultAdvancePercent.message}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                Minimum payment to confirm booking
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Booking Validity (Days)</label>
              <input
                type="number"
                {...register('bookingValidityDays', { 
                  required: true,
                  min: { value: 1, message: 'Must be at least 1 day' }
                })}
                className="input-field"
              />
              {errors.bookingValidityDays && (
                <p className="text-red-500 text-xs mt-1">{errors.bookingValidityDays.message}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                Auto-expire unconfirmed bookings after
              </p>
            </div>
          </div>
        </div>

        {/* Operational Parameters */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
            Operational Parameters
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Test Drive Window (Minutes)</label>
              <input
                type="number"
                {...register('testDriveDuration', { 
                  required: true,
                  min: { value: 1, message: 'Must be at least 1 minute' }
                })}
                className="input-field"
              />
              {errors.testDriveDuration && (
                <p className="text-red-500 text-xs mt-1">{errors.testDriveDuration.message}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                Standard slot duration for test drives
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Inventory Lead Time (Days)</label>
              <input
                type="number"
                {...register('dispatchLeadDays', { 
                  required: true,
                  min: { value: 0, message: 'Must be at least 0 days' }
                })}
                className="input-field"
              />
              {errors.dispatchLeadDays && (
                <p className="text-red-500 text-xs mt-1">{errors.dispatchLeadDays.message}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                Buffer between arrival and dispatch
              </p>
            </div>
          </div>
        </div>

        {/* Communication Settings */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
            Communication Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                {...register('emailNotifications')} 
                className="form-checkbox h-5 w-5 text-hyundai-blue"
              />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                  Email Notifications
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Send automated emails to staff and customers
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                {...register('smsNotifications')} 
                className="form-checkbox h-5 w-5 text-hyundai-blue"
              />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                  SMS Reminders
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Trigger text alerts for appointments
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={mutation.isPending || !hasUnsavedChanges}
            className="btn btn-primary"
            style={{ opacity: hasUnsavedChanges ? 1 : 0.6 }}
          >
            {mutation.isPending && <span className="spinner spinner-sm" />}
            <Save style={{ width: 16, height: 16 }} />
            {mutation.isPending ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettingsTab;
