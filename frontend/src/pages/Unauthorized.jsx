import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div
          style={{
            width: 72,
            height: 72,
            backgroundColor: '#FEF2F2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShieldOff style={{ width: 32, height: 32, color: '#DC2626' }} />
        </div>

        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#DC2626',
            marginBottom: '0.5rem',
          }}
        >
          403 — Access Denied
        </p>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0F172A',
            marginBottom: '0.75rem',
          }}
        >
          You don't have permission
        </h1>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748B',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Your account doesn't have the required role to access this page. Contact your system administrator if you believe this is an error.
        </p>

        <Link
          to="/dashboard"
          className="btn btn-primary"
          style={{ display: 'inline-flex', textDecoration: 'none' }}
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
