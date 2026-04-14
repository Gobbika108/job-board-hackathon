// Navbar - premium modern navigation
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Jump<span className="accent">start</span>
        </Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <Link to={user.role === 'company' ? '/dashboard' : '/'} className="navbar-link">
                {user.role === 'company' ? 'My Jobs' : 'Jobs'}
              </Link>
              
              <div className="navbar-user">
                <div className="user-avatar">{getInitials(user.name)}</div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              
              {user.role === 'student' && (
                <Link to="/my-applications" className="navbar-link">Applications</Link>
              )}
              
              {user.role === 'company' && (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/post-job" className="navbar-link">Post Job</Link>
                </>
              )}
              
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;