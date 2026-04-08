import { AlertTriangle } from 'lucide-react';
import Modal from '../Modal';

/**
 * ConfirmDialog - Reusable confirmation dialog for destructive actions
 * 
 * @param {boolean} isOpen - Dialog open state
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm handler
 * @param {string} title - Dialog title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Confirm button text (default: "Confirm")
 * @param {string} cancelText - Cancel button text (default: "Cancel")
 * @param {string} variant - Button variant: "danger" | "primary" (default: "danger")
 * @param {boolean} isLoading - Loading state for confirm button
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: variant === 'danger' ? '#FEF2F2' : '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle style={{
              width: 20,
              height: 20,
              color: variant === 'danger' ? '#DC2626' : '#1D4ED8'
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
              {message}
            </p>
          </div>
        </div>
        
        <div className="modal-footer" style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner spinner-sm" />
                Processing...
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
