// JobDetail - full job info with Apply button or management link
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    loadJob();
    checkIfApplied();
  }, [id]);

  const loadJob = async () => {
    try {
      const data = await getJob(id);
      setJob(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    // We need to check via the applications endpoint - but we don't have a simple endpoint for this
    // For simplicity, we'll just let the apply form handle the validation
    // Actually, let's just track it locally - the backend will reject duplicates anyway
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem 20px' }}>Loading...</div>;
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="alert alert-error">{error || 'Job not found'}</div>
      </div>
    );
  }

  const isDeadlinePassed = new Date(job.deadline) < new Date();
  const companyName = job.companyId?.name || 'Unknown Company';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const showApplyButton = user?.role === 'student' && !isDeadlinePassed;
  const showManageLink = user?.role === 'company' && user?.userId === job.companyId?._id;

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div className="job-detail">
        <h1>{job.title}</h1>
        <p className="job-detail-company">{companyName}</p>
        
        <div className="job-card-meta" style={{ marginBottom: '1.5rem' }}>
          <span className={`badge badge-${job.location}`}>{job.location}</span>
          <span className={`badge badge-${job.type}`}>{job.type}</span>
          <span className={`badge badge-${job.category}`}>{job.category}</span>
        </div>

        <div className="job-detail-section">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-detail-section">
          <h3>Requirements</h3>
          <p>{job.requirements}</p>
        </div>

        <div className="job-detail-section">
          <h3>Stipend</h3>
          <p>{job.stipend ? `$${job.stipend.toLocaleString()}` : 'Unpaid'}</p>
        </div>

        <div className="job-detail-section">
          <h3>Deadline</h3>
          <p>
            {formatDate(job.deadline)}
            {isDeadlinePassed && <span className="badge badge-deadline" style={{ marginLeft: '0.5rem' }}>Deadline passed</span>}
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {showApplyButton && (
            <Link to={`/jobs/${id}/apply`} className="btn btn-primary">
              Apply Now
            </Link>
          )}
          
          {showManageLink && (
            <Link to={`/dashboard`} className="btn btn-secondary">
              Manage Applications
            </Link>
          )}
          
          {!user && (
            <Link to="/login" className="btn btn-primary">
              Login to Apply
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;