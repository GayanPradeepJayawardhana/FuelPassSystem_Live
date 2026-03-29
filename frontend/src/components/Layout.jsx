import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="app-wrapper">
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            ⛽ Fuel Manager
          </div>

          <ul className="navbar-menu">
            {user?.role === 'user' && <li><a href="/user">Dashboard</a></li>}
            {user?.role === 'admin' && <li><a href="/admin">Admin Panel</a></li>}
            {user?.role === 'operator' && <li><a href="/operator">Operator Panel</a></li>}
            {user && <li><a href="/">Home</a></li>}
          </ul>

          <div className="user-profile">
            {user && (
              <>
                <div>
                  <p className="mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500' }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                    {user.role}
                  </p>
                </div>
                <div className="user-avatar">{getInitials()}</div>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
