import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { LoginSchema } from '../utils/schemas';
import { Mail, Lock, Car, AlertCircle } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else if (response.token) {
        login(response.token, response.user || response);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Brand Panel */}
      <div className="auth-brand-panel">
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div
            style={{
              width: 52,
              height: 52,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Car style={{ width: 26, height: 26, color: '#fff' }} />
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}
          >
            HYUNDAI
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '0.5rem',
            }}
          >
            Dealer Management System
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              maxWidth: 320,
            }}
          >
            Streamline your dealership operations — manage inventory, bookings, test drives, and reporting in one place.
          </p>

          {/* Feature List */}
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Real-time inventory tracking', 'Booking & delivery management', 'Test drive scheduling', 'Performance analytics'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#00AAD2',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Sign in
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Details */}
          {error && (
            <div className="alert-banner danger" style={{ marginBottom: '1rem' }}>
              <AlertCircle style={{ width: 16, height: 16, color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: '0.8125rem', color: '#DC2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address <span className="text-red-500">*</span></label>
              <div className="input-with-icon">
                <Mail className="input-icon" style={{ width: 15, height: 15 }} />
                <input
                  id="login-email"
                  type="text"
                  {...register('email')}
                  className={`input-field ${errors.email ? 'border border-red-500' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password <span className="text-red-500">*</span></label>
              <div className="input-with-icon">
                <Lock className="input-icon" style={{ width: 15, height: 15 }} />
                <input
                  id="login-password"
                  type="password"
                  {...register('password')}
                  className={`input-field ${errors.password ? 'border border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ justifyContent: 'center', marginTop: '0.25rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748B' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#002C5F', fontWeight: 600, textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
