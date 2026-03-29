import { useEffect, useState, useContext } from 'react';
import { getAllUsers, getAllVehicles, updateFuelQuota, searchVehicle } from '../api/adminApi';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [quota, setQuota] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      const vehiclesData = await getAllVehicles();
      setUsers(usersData.data);
      setVehicles(vehiclesData.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateQuota = async (id) => {
    try {
      const amount = quota[id];
      await updateFuelQuota(id, Number(amount));
      alert('Quota updated successfully');
      setQuota({ ...quota, [id]: '' });
      
      // Update the search results with new quota if they exist
      if (searchResults.length > 0) {
        const updatedSearchResults = searchResults.map(v => 
          v._id === id ? { ...v, weeklyQuota: Number(amount) } : v
        );
        setSearchResults(updatedSearchResults);
      }
      
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating quota');
    }
  };

  const handleSearchVehicle = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchVehicle(searchTerm);
      setSearchResults(response.data);
    } catch (err) {
      alert('Error searching vehicle: ' + (err.response?.data?.message || err.message));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <Layout>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Admin Panel 🔧</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            System configuration and user management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
          <div className="stat-card">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{users.length}</p>
          </div>
          <div className="stat-card secondary">
            <p className="stat-label">Active Vehicles</p>
            <p className="stat-value">{vehicles.length}</p>
          </div>
          <div className="stat-card success">
            <p className="stat-label">System Health</p>
            <p className="stat-value" style={{ fontSize: '1.5rem' }}>✓</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '3rem' }}>
          <div className="card-header">
            <h3 className="card-title">⚡ Quick Actions</h3>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button className="btn btn-success" style={{ justifyContent: 'center' }}>
              🔄 Reset All Quotas
            </button>
            <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
              📊 View Reports
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              ⚙️ System Settings
            </button>
            <button className="btn btn-danger" style={{ justifyContent: 'center' }}>
              🔐 Backup Data
            </button>
          </div>
        </div>

        {/* Users Section */}
        <div className="card" style={{ marginBottom: '3rem' }}>
          <div className="card-header">
            <h3 className="card-title">👥 All Users ({users.length})</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div> Loading users...
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No users registered yet
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>NIC</th>
                      <th>Mobile</th>
                      <th>Address</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.NIC}</td>
                        <td>{u.mobile}</td>
                        <td>{u.address}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'operator' ? 'badge-warning' : 'badge-primary'}`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🚗 Vehicle Management ({vehicles.length})</h3>
          </div>
          
          {/* Vehicle Search Section */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)', backgroundColor: 'var(--bg-secondary)' }}>
            <form onSubmit={handleSearchVehicle} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>🔍 Search Vehicle by Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter vehicle number (e.g., ABC-1234)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginBottom: '0' }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearching}
              >
                {isSearching ? '🔄 Searching...' : '🔍 Search'}
              </button>
              {searchResults.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearSearch}
                >
                  ✕ Clear
                </button>
              )}
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--border-radius)', border: '2px solid var(--primary)' }}>
                <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Found {searchResults.length} vehicle(s):</p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {searchResults.map(v => (
                    <div key={v._id} style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-300)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ marginBottom: '0.5rem' }}>🏷️ {v.vehicleNumber}</h4>
                          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Type: <strong>{v.vehicleType}</strong>
                          </p>
                          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
                            Owner: <strong>{v.user?.firstName} {v.user?.lastName}</strong>
                          </p>
                        </div>

                        <div>
                          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Current Quota</p>
                          <p style={{ fontWeight: 600, marginBottom: '0' }}>
                            {v.remainingQuota.toFixed(2)} / {v.weeklyQuota.toFixed(2)} L
                          </p>
                          <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: 'var(--gray-200)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            marginTop: '0.5rem'
                          }}>
                            <div
                              style={{
                                width: `${Math.round((v.remainingQuota / v.weeklyQuota) * 100)}%`,
                                height: '100%',
                                backgroundColor: 'var(--success)'
                              }}
                            ></div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="New quota"
                            value={quota[v._id] || ''}
                            onChange={(e) => setQuota({ ...quota, [v._id]: e.target.value })}
                            style={{ width: '120px', marginBottom: '0' }}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateQuota(v._id)}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-body">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div> Loading vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No vehicles registered yet
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {vehicles.map(v => (
                  <div key={v._id} className="card" style={{ border: '1px solid var(--gray-300)', padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ marginBottom: '0.5rem' }}>🏷️ {v.vehicleNumber}</h4>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Type: <strong>{v.vehicleType}</strong>
                        </p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
                          Owner: <strong>{v.user?.firstName} {v.user?.lastName}</strong>
                        </p>
                      </div>

                      <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Current Quota</p>
                        <p style={{ fontWeight: 600, marginBottom: '0' }}>
                          {v.remainingQuota.toFixed(2)} / {v.weeklyQuota.toFixed(2)} L
                        </p>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'var(--gray-200)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginTop: '0.5rem'
                        }}>
                          <div
                            style={{
                              width: `${Math.round((v.remainingQuota / v.weeklyQuota) * 100)}%`,
                              height: '100%',
                              backgroundColor: 'var(--success)'
                            }}
                          ></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="New quota"
                          value={quota[v._id] || ''}
                          onChange={(e) => setQuota({ ...quota, [v._id]: e.target.value })}
                          style={{ width: '120px', marginBottom: '0' }}
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateQuota(v._id)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;