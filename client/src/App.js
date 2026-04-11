// Main App with routing and auth protection
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import Apply from './pages/Apply';
import MyApplications from './pages/MyApplications';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';
import './index.css';

// Protected route wrapper
const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

// Public route - redirects if already logged in
const PublicRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to={user.role === 'company' ? '/dashboard' : '/'} replace />;
  }
  
  return <Outlet />;
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/login" element={<><PublicRoute /><Login /></>} />
        <Route path="/signup" element={<><PublicRoute /><Signup /></>} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs/:id/apply" element={<><ProtectedRoute allowedRole="student" /><Apply /></>} />
        <Route path="/my-applications" element={<><ProtectedRoute allowedRole="student" /><MyApplications /></>} />
        <Route path="/dashboard" element={<><ProtectedRoute allowedRole="company" /><CompanyDashboard /></>} />
        <Route path="/post-job" element={<><ProtectedRoute allowedRole="company" /><PostJob /></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;