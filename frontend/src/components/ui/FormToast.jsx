import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Inline form toast — shows success or error message inside the form.
 * Props: toast: { type, message } | null, onClose: fn
 */
const FormToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        padding: '0.75rem 1rem',
        borderRadius: 8,
        border: `1px solid ${isSuccess ? '#BBF7D0' : '#FECACA'}`,
        backgroundColor: isSuccess ? '#F0FDF4' : '#FEF2F2',
        marginBottom: '1rem',
        animation: 'fade-in 0.2s ease',
      }}
    >
      {isSuccess
        ? <CheckCircle2 style={{ width: 16, height: 16, color: '#15803D', flexShrink: 0, marginTop: 1 }} />
        : <AlertCircle  style={{ width: 16, height: 16, color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
      }
      <p style={{ fontSize: '0.8125rem', color: isSuccess ? '#15803D' : '#DC2626', flex: 1, lineHeight: 1.5 }}>
        {toast.message}
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isSuccess ? '#15803D' : '#DC2626', opacity: 0.6 }}
          aria-label="Dismiss"
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
};

export default FormToast;
