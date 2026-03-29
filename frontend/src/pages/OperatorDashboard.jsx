import { useState, useContext } from 'react';
import { verifyVehicle, fuelVehicle } from '../api/operatorApi';
import Layout from '../components/Layout';
import QRScanner from '../components/QRScanner';
import { AuthContext } from '../context/AuthContext';

function OperatorDashboard() {
  const [vehicleId, setVehicleId] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [fuelAmount, setFuelAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const { user } = useContext(AuthContext);

  const handleVerify = async () => {
    if (!vehicleId) {
      setError('Please enter a Vehicle ID or scan QR code');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data } = await verifyVehicle({ vehicleId });
      setVehicle(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Vehicle not found');
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFuel = async () => {
    if (!fuelAmount || Number(fuelAmount) <= 0) {
      setError('Please enter a valid fuel amount');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data } = await fuelVehicle({
        vehicleId,
        fuelAmount: Number(fuelAmount),
      });

      setSuccessMsg(data.message || 'Fuel dispensed successfully!');
      setVehicle(null);
      setFuelAmount('');
      setVehicleId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error dispensing fuel');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handleQRScanned = (scannedData) => {
    setVehicleId(scannedData);
    setShowScanner(false);
    // Auto-verify after a brief delay to show the scanned data
    setTimeout(() => {
      setError('');
      setSuccessMsg('');
      setLoading(true);

      verifyVehicle({ vehicleId: scannedData })
        .then(({ data }) => {
          setVehicle(data);
          setError('');
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Vehicle not found');
          setVehicle(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };

  return (
    <Layout>
      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Fuel Station 🚗⛽</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Dispense fuel to verified vehicles
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-2" style={{ marginBottom: '3rem' }}>
          <div className="stat-card">
            <p className="stat-label">Operator</p>
            <p className="stat-value" style={{ fontSize: '1.25rem' }}>{user?.firstName}</p>
          </div>
          <div className="stat-card secondary">
            <p className="stat-label">Status</p>
            <p className="stat-value" style={{ fontSize: '1.5rem' }}>🟢 Online</p>
          </div>
        </div>

        {/* Vehicle Verification */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">🔍 Verify Vehicle</h3>
          </div>

          {error && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success">
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Vehicle ID / Scan QR Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="Scan QR code or enter vehicle ID"
                value={vehicleId}
                onChange={(e) => {
                  setVehicleId(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Verifying...
                  </>
                ) : (
                  '🔍 Verify Vehicle'
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowScanner(true)}
                disabled={loading}
                title="Use camera to scan QR code"
              >
                📱 Scan QR
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Details & Fuel Dispenser */}
        {vehicle && (
          <div className="card animate-slide-up">
            <div className="card-header" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
              <h3 className="card-title" style={{ color: 'white', marginBottom: '0' }}>
                ✓ Vehicle Verified
              </h3>
            </div>

            <div className="card-body">
              {/* Vehicle Information */}
              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Vehicle Number</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0' }}>{vehicle.vehicleNumber}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Vehicle Type</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0', textTransform: 'capitalize' }}>
                      {vehicle.vehicleType}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Vehicle Owner</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0' }}>
                      {vehicle.user?.firstName} {vehicle.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>NIC</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0' }}>
                      {vehicle.user?.NIC}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fuel Quota Status */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Current Fuel Quota</label>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {vehicle.remainingQuota.toFixed(2)} / {vehicle.weeklyQuota.toFixed(2)} L
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '15px',
                  backgroundColor: 'var(--gray-200)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      width: `${Math.round((vehicle.remainingQuota / vehicle.weeklyQuota) * 100)}%`,
                      height: '100%',
                      backgroundColor: vehicle.remainingQuota > vehicle.weeklyQuota * 0.5 ? 'var(--success)' : vehicle.remainingQuota > vehicle.weeklyQuota * 0.25 ? 'var(--warning)' : 'var(--danger)',
                      transition: 'var(--transition)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Fuel Dispenser */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Amount to Dispense (Liters)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter fuel amount"
                    value={fuelAmount}
                    onChange={(e) => {
                      setFuelAmount(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
                {[5, 10, 20, 30].map(amount => (
                  <button
                    key={amount}
                    className="btn btn-outline"
                    onClick={() => setFuelAmount(String(amount))}
                    disabled={loading}
                  >
                    {amount}L
                  </button>
                ))}
              </div>

              {/* Dispense Button */}
              <button
                className="btn btn-success btn-block btn-lg"
                onClick={handleFuel}
                disabled={loading || !fuelAmount}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Dispensing...
                  </>
                ) : (
                  '⛽ Dispense Fuel'
                )}
              </button>

              {/* Cancel Button */}
              <button
                className="btn btn-outline btn-block"
                onClick={() => {
                  setVehicle(null);
                  setFuelAmount('');
                  setVehicleId('');
                }}
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!vehicle && (
          <div className="alert alert-primary" style={{ marginTop: '2rem' }}>
            <span>ℹ️</span>
            <div>
              <strong>Instructions:</strong>
              <ul style={{ marginBottom: '0', paddingLeft: '1.5rem' }}>
                <li>Scan the vehicle QR code or enter the Vehicle ID</li>
                <li>Verify vehicle details</li>
                <li>Enter the fuel amount to dispense</li>
                <li>Click "Dispense Fuel" to complete the transaction</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default OperatorDashboard;