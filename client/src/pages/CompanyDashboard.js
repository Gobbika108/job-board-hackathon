// CompanyDashboard - companies see their jobs and applicants
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobs, getJobApplicants, updateApplicationStatus } from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'company') {
      loadCompanyJobs();
    }
  }, []);

  const loadCompanyJobs = async () => {
    try {
      const allJobs = await getJobs();
      // Filter to only company's own jobs
      const companyJobs = allJobs.filter(job => job.companyId?._id === user.userId);
      setJobs(companyJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (jobId) => {
    try {
      const data = await getJobApplicants(jobId);
      setApplicants(data);
      setSelectedJob(jobId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      // Refresh applicants list
      if (selectedJob) {
        loadApplicants(selectedJob);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (user?.role !== 'company') {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="alert alert-error">Only companies can access this page.</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Dashboard</h1>
        <Link to="/post-job" className="btn btn-primary">Post New Job</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job" style={{ marginTop: '1rem', display: 'inline-block' }}>Post Your First Job</Link>
        </div>
      ) : (
        <div className="dashboard-section">
          <h3 style={{ marginBottom: '1rem' }}>Your Posted Jobs</h3>
          <div className="application-list">
            {jobs.map(job => (
              <div 
                key={job._id} 
                className="dashboard-job"
                onClick={() => loadApplicants(job._id)}
                style={{ cursor: 'pointer', background: selectedJob === job._id ? 'var(--bg)' : 'transparent' }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {job.location} · {job.type} · {job.category}
                  </div>
                </div>
                <div className={`badge badge-${new Date(job.deadline) < new Date() ? 'deadline' : job.location}`}>
                  {new Date(job.deadline) < new Date() ? 'Expired' : job.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJob && applicants.length > 0 && (
        <div className="dashboard-section">
          <h3 style={{ marginBottom: '1rem' }}>Applicants</h3>
          <div className="application-list">
            {applicants.map(app => (
              <div key={app._id} className="applicant-row">
                <div>
                  <div style={{ fontWeight: 600 }}>{app.studentId?.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{app.studentId?.email}</div>
                </div>
                <div>{new Date(app.appliedAt).toLocaleDateString()}</div>
                <StatusBadge status={app.status} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a 
                    href={`http://localhost:5000/uploads/${app.resumePath}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Resume
                  </a>
                  <select
                    className="form-select"
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="applied">Applied</option>
                    <option value="under review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJob && applicants.length === 0 && (
        <div className="empty-state">
          <p>No applicants yet for this job.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;