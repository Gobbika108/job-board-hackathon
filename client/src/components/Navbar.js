// Navbar - role-based navigation with user info and logout
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

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">Student Job Board</Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <span className="navbar-user">
                {user.name} ({user.role})
              </span>
              
              {user.role === 'student' && (
                <Link to="/my-applications">My Applications</Link>
              )}
              
              {user.role === 'company' && (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/post-job">Post Job</Link>
                </>
              )}
              
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;