import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserPlus, Mail, Lock, User, Building, Phone, Car, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dealershipName: '',
    role: 'SALES_EXECUTIVE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }

    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Phone must be a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, dealershipName, ...userData } = formData;
      const response = await authService.register(userData);
      if (response.success || response.token) {
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please try again.';
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
          <div
            style={{
              width: 52, height: 52,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Car style={{ width: 26, height: 26, color: '#fff' }} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            HYUNDAI
          </h2>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
            Create Your Account
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 320 }}>
            Join the Hyundai DMS platform. Once registered, your dealership administrator will assign your access level.
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel" style={{ alignItems: 'flex-start', overflowY: 'auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="auth-form-card" style={{ maxWidth: 520 }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Create Account
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Fill in the details below to get started.
            </p>
          </div>

          {error && (
            <div className="alert-banner danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle style={{ width: 16, height: 16, color: '#DC2626', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8125rem', color: '#DC2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <User className="input-icon" style={{ width: 15, height: 15 }} />
                  <input id="signup-name" type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" required />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">
                  Email Address <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <Mail className="input-icon" style={{ width: 15, height: 15 }} />
                  <input id="signup-email" type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" required />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-phone">Phone Number</label>
                <div className="input-with-icon">
                  <Phone className="input-icon" style={{ width: 15, height: 15 }} />
                  <input id="signup-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 98765 43210" />
                </div>
                <p className="form-hint">10-digit Indian mobile number</p>
              </div>

              {/* Dealership */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-dealership">Dealership Name</label>
                <div className="input-with-icon">
                  <Building className="input-icon" style={{ width: 15, height: 15 }} />
                  <input id="signup-dealership" type="text" name="dealershipName" value={formData.dealershipName} onChange={handleChange} className="input-field" placeholder="Hyundai Showroom" />
                </div>
                <p className="form-hint">Can be assigned later by admin</p>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">
                  Password <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <Lock className="input-icon" style={{ width: 15, height: 15 }} />
                  <input id="signup-password" type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="Min 8 chars, A-Z, a-z, 0-9" required />
                </div>
                <p className="form-hint">Must include uppercase, lowercase, and a number</p>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm">
                  Confirm Password <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <Lock className="input-icon" style={{ width: 15, height: 15 }} />
                  <input id="signup-confirm" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="Re-enter password" required />
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-role">
                Role <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select id="signup-role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="SALES_EXECUTIVE">Sales Executive</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus style={{ width: 16, height: 16 }} />
                  Create Account
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748B' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#002C5F', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
