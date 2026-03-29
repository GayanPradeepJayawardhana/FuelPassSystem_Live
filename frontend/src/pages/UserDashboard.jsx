import { useEffect, useState, useContext } from 'react';
import { addVehicle, getMyVehicles, deleteVehicle } from '../api/vehicleApi';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

function UserDashboard() {
  const [form, setForm] = useState({
    vehicleNumber: '',
    vehicleType: '',
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { user } = useContext(AuthContext);

  const vehicleTypes = ['car', 'bike', 'van', 'bus', 'threewheel'];

  const fetchVehicles = async () => {
    setFetchingVehicles(true);
    try {
      const { data } = await getMyVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setFetchingVehicles(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.vehicleNumber || !form.vehicleType) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await addVehicle(form);
      setSuccessMsg('Vehicle added successfully!');
      setForm({ vehicleNumber: '', vehicleType: '' });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const getQuotaPercentage = (remaining, total) => {
    return total > 0 ? Math.round((remaining / total) * 100) : 0;
  };

  const getQuotaColor = (percentage) => {
    if (percentage > 50) return 'var(--success)';
    if (percentage > 25) return 'var(--warning)';
    return 'var(--danger)';
  };

  const handleDeleteVehicle = async (vehicleId, vehicleNumber) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicleNumber}? This action cannot be undone.`)) {
      try {
        await deleteVehicle(vehicleId);
        setSuccessMsg(`Vehicle ${vehicleNumber} deleted successfully!`);
        fetchVehicles();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete vehicle');
      }
    }
  };

  return (
    <Layout>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Welcome, {user?.firstName}! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Manage your vehicles and fuel quota
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Add Vehicle Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">➕ Add New Vehicle</h3>
            </div>

            {error && <div className="alert alert-danger"><span>⚠️</span><span>{error}</span></div>}
            {successMsg && <div className="alert alert-success"><span>✓</span><span>{successMsg}</span></div>}

            <form onSubmit={handleSubmit} className="card-body">
              <div className="form-group">
                <label className="form-label">Vehicle Number / Plate</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  className="form-input"
                  placeholder="e.g., ABC-1234"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  name="vehicleType"
                  className="form-select"
                  value={form.vehicleType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Adding...
                  </>
                ) : (
                  '✓ Add Vehicle'
                )}
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div>
            <div className="stat-card" style={{ marginBottom: '1rem' }}>
              <p className="stat-label">Total Vehicles</p>
              <p className="stat-value">{vehicles.length}</p>
            </div>
            <div className="stat-card secondary">
              <p className="stat-label">Active Status</p>
              <p className="stat-value" style={{ fontSize: '1.5rem' }}>✓</p>
            </div>
          </div>
        </div>

        {/* Vehicles List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🚗 My Vehicles</h3>
          </div>

          <div className="card-body">
            {fetchingVehicles ? (
              <div className="loading">
                <div className="spinner"></div> Loading vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>📋 No vehicles added yet</p>
                <p>Add your first vehicle using the form above to start managing your fuel quota</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {vehicles.map(vehicle => {
                  const quotaPercentage = getQuotaPercentage(vehicle.remainingQuota, vehicle.weeklyQuota);
                  return (
                    <div
                      key={vehicle._id}
                      className="card"
                      style={{
                        border: '2px solid var(--gray-200)',
                        padding: '1.5rem',
                        marginBottom: '0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ marginBottom: '0.25rem' }}>🏷️ {vehicle.vehicleNumber}</h4>
                          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
                            Type: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)}
                            </span>
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                          <span className={`badge ${quotaPercentage > 50 ? 'badge-success' : quotaPercentage > 25 ? 'badge-warning' : 'badge-danger'}`}>
                            {quotaPercentage}% Remaining
                          </span>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteVehicle(vehicle._id, vehicle.vehicleNumber)}
                            title="Delete this vehicle"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Fuel Quota</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            {vehicle.remainingQuota.toFixed(2)} / {vehicle.weeklyQuota.toFixed(2)} L
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: 'var(--gray-200)',
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <div
                            style={{
                              width: `${quotaPercentage}%`,
                              height: '100%',
                              backgroundColor: getQuotaColor(quotaPercentage),
                              transition: 'var(--transition)'
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* QR Code */}
                      {vehicle.qrCode && (
                        <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>QR Code for Fuel Stations</p>
                          <img
                            src={vehicle.qrCode}
                            alt="QR Code"
                            style={{
                              width: '150px',
                              height: '150px',
                              border: '2px solid var(--gray-300)',
                              borderRadius: 'var(--border-radius)',
                              padding: '0.5rem'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UserDashboard;