import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';

function Register() {
  const [form, setForm] = useState({
    NIC: '',
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.NIC || !form.firstName || !form.mobile || !form.address || !form.password) {
      setError('Please fill in all required fields (Last Name is optional)');
      return;
    }

    // Validate mobile number is exactly 10 digits
    if (!/^\d{10}$/.test(form.mobile)) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        NIC: form.NIC,
        firstName: form.firstName,
        lastName: form.lastName || '', // Send empty string if not provided
        mobile: form.mobile,
        address: form.address,
        password: form.password,
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>⛽</h1>
          <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Join our fuel management system</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>(Optional)</span></label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">NIC / ID Number</label>
            <input
              type="text"
              name="NIC"
              className="form-input"
              placeholder="Your NIC"
              value={form.NIC}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>(10 digits)</span></label>
            <input
              type="tel"
              name="mobile"
              className="form-input"
              placeholder="10-digit phone number"
              value={form.mobile}
              onChange={handleChange}
              disabled={loading}
              maxLength="10"
              inputMode="numeric"
            />
            {form.mobile && form.mobile.length !== 10 && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Mobile number must be exactly 10 digits ({form.mobile.length}/10)
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Your address"
              value={form.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
          <p style={{ marginBottom: '0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;