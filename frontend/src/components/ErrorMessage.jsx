import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
    <div
      style={{
        width: 48, height: 48,
        backgroundColor: '#FEF2F2',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem',
      }}
    >
      <AlertCircle style={{ width: 22, height: 22, color: '#DC2626' }} />
    </div>
    <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
      Something went wrong
    </p>
    <p style={{ color: '#64748B', fontSize: '0.8125rem', marginBottom: '1.25rem', maxWidth: 320 }}>
      {message}
    </p>
    {onRetry && (
      <button onClick={onRetry} className="btn btn-secondary btn-sm">
        <RotateCcw style={{ width: 13, height: 13 }} />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
