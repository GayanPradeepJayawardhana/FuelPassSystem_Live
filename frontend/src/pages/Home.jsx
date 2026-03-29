import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        padding: '1rem'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛽ Fuel Manager</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Efficient Fuel Quota Management System</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              className="btn btn-outline btn-lg"
              style={{ borderColor: 'white', color: 'white' }}
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1>Welcome to Fuel Manager! 👋</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Your efficient fuel quota management system
          </p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
          <div className="stat-card">
            <p className="stat-label">System Status</p>
            <p className="stat-value" style={{ fontSize: '1.5rem' }}>🟢 Active</p>
          </div>
          <div className="stat-card secondary">
            <p className="stat-label">Connected</p>
            <p className="stat-value" style={{ fontSize: '1.5rem' }}>✓</p>
          </div>
          <div className="stat-card success">
            <p className="stat-label">Version</p>
            <p className="stat-value">1.0</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🚗 User Features</h3>
            </div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Register and manage your account</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Add and track multiple vehicles</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Monitor fuel quota usage</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Generate QR codes for fuel stations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">⚙️ System Features</h3>
            </div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Role-based access control</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Secure authentication (JWT)</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>MongoDB database integration</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Real-time quota updates</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">👥 Admin Panel</h3>
            </div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>System configuration</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>User management</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>Set fuel quotas by vehicle type</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span>✓</span> <span>View system analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
