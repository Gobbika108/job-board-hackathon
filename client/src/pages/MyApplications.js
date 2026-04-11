// MyApplications - student's applications list with status badges
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyApplications } from '../utils/api';
import ApplicationRow from '../components/ApplicationRow';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'student') {
      loadApplications();
    }
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'student') {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="alert alert-error">Only students can view their applications.</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any jobs yet.</p>
          <a href="/" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Jobs</a>
        </div>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Date Applied</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <ApplicationRow key={app._id} application={app} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;