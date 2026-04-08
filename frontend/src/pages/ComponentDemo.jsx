import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../components/ui/FileUpload';
import Toast from '../components/ui/Toast';
import FormInput from '../components/ui/FormInput';
import ProtectedAction from '../components/ui/ProtectedAction';
import KeyboardShortcutsHelp from '../components/ui/KeyboardShortcutsHelp';
import { useToast } from '../hooks/useToast';
import { usePermissions } from '../hooks/usePermissions';
import { useKeyboardShortcuts, SHORTCUTS } from '../hooks/useKeyboardShortcuts';

/**
 * Component Demo Page - Test all new reusable components
 * This page is for development/testing only
 */
const ComponentDemo = () => {
  const { toast, showSuccess, showError, showInfo, clearToast } = useToast();
  const { can, userRole } = usePermissions();
  const { register, formState: { errors }, watch } = useForm();
  
  const [files, setFiles] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    [SHORTCUTS.HELP]: () => setShowShortcuts(true),
    [SHORTCUTS.CLOSE]: () => setShowShortcuts(false),
    'ctrl+1': () => showSuccess('Success toast triggered!'),
    'ctrl+2': () => showError('Error toast triggered!'),
    'ctrl+3': () => showInfo('Info toast triggered!')
  });

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <Toast toast={toast} onClose={clearToast} />
      <KeyboardShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          Component Demo
        </h1>
        <p style={{ color: '#6B7280' }}>
          Testing all new reusable components. Current role: <strong>{userRole}</strong>
        </p>
      </div>

      {/* Toast Demo */}
      <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Toast Notifications</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => showSuccess('Operation completed successfully!')} className="btn btn-primary">
            Show Success
          </button>
          <button onClick={() => showError('Something went wrong!')} className="btn btn-danger">
            Show Error
          </button>
          <button onClick={() => showInfo('Here is some information')} className="btn btn-secondary">
            Show Info
          </button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
          Keyboard shortcuts: Ctrl+1 (success), Ctrl+2 (error), Ctrl+3 (info)
        </p>
      </section>

      {/* FileUpload Demo */}
      <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>File Upload</h2>
        <FileUpload
          label="Upload Files"
          name="demoFiles"
          onChange={setFiles}
          accept={['image/jpeg', 'image/png', 'application/pdf']}
          maxSize={5}
          multiple={true}
          hint="Drag and drop files or click to browse"
        />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
          Files selected: {files.length}
        </p>
      </section>

      {/* FormInput Demo */}
      <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Enhanced Form Inputs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
            required
            showSuccess
            placeholder="Enter your email"
            hint="We'll never share your email"
            value={watch('email')}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            register={register}
            error={errors.phone?.message}
            required
            placeholder="Enter phone number"
            value={watch('phone')}
          />
        </div>
      </section>

      {/* ProtectedAction Demo */}
      <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Role-Based Actions</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
          Your role: <strong>{userRole}</strong>
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <ProtectedAction permission="canAddVehicle">
            <button className="btn btn-primary">Add Vehicle (Admin/Manager only)</button>
          </ProtectedAction>
          
          <ProtectedAction permission="canDeleteVehicle">
            <button className="btn btn-danger">Delete Vehicle (Admin only)</button>
          </ProtectedAction>
          
          <ProtectedAction permission="canCreateBooking">
            <button className="btn btn-primary">Create Booking (All except Senior Official)</button>
          </ProtectedAction>
          
          <ProtectedAction permission="canViewReports">
            <button className="btn btn-secondary">View Reports (Admin/Manager/Senior Official)</button>
          </ProtectedAction>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: 6 }}>
          <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
            <strong>Permission Check Results:</strong>
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#6B7280', paddingLeft: '1.5rem' }}>
            <li>Can add vehicle: {can('canAddVehicle') ? '✅ Yes' : '❌ No'}</li>
            <li>Can delete vehicle: {can('canDeleteVehicle') ? '✅ Yes' : '❌ No'}</li>
            <li>Can create booking: {can('canCreateBooking') ? '✅ Yes' : '❌ No'}</li>
            <li>Can view reports: {can('canViewReports') ? '✅ Yes' : '❌ No'}</li>
          </ul>
        </div>
      </section>

      {/* Keyboard Shortcuts Demo */}
      <section style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Keyboard Shortcuts</h2>
        <button onClick={() => setShowShortcuts(true)} className="btn btn-secondary">
          Show Shortcuts (or press Ctrl + /)
        </button>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: 6, border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: '0.875rem', color: '#1D4ED8' }}>
            💡 Try pressing <kbd style={{ padding: '0.125rem 0.375rem', backgroundColor: '#FFFFFF', border: '1px solid #93C5FD', borderRadius: 3, fontFamily: 'monospace' }}>Ctrl</kbd> + <kbd style={{ padding: '0.125rem 0.375rem', backgroundColor: '#FFFFFF', border: '1px solid #93C5FD', borderRadius: 3, fontFamily: 'monospace' }}>/</kbd> to open shortcuts help
          </p>
        </div>
      </section>
    </div>
  );
};

export default ComponentDemo;
