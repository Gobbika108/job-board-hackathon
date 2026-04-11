// JobCard - premium modern job card component
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const isDeadlinePassed = new Date(job.deadline) < new Date();
  const companyName = job.companyId?.name || 'Company';
  const companyInitial = companyName.charAt(0).toUpperCase();
  const stipendDisplay = job.stipend ? `$${job.stipend.toLocaleString()}` : 'Unpaid';
  
  const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft > 0 && daysLeft <= 3;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="job-card">
      <Link to={`/jobs/${job._id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
        <div className="job-card-header">
          <div className="company-logo">{companyInitial}</div>
          <div style={{ flex: 1 }}>
            <div className="job-card-badges">
              <span className={`badge badge-${job.location}`}>
                {job.location === 'remote' ? 'Remote' : 'On-site'}
              </span>
              <span className={`badge badge-${job.type}`}>
                {job.type === 'internship' ? 'Internship' : job.type === 'part-time' ? 'Part-time' : 'Full-time'}
              </span>
              <span className={`badge badge-${job.category}`}>
                {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="job-card-title">{job.title}</div>
        <div className="job-card-company">{companyName}</div>
        
        <div className="job-card-divider"></div>
        
        <div className="job-card-meta">
          <span>Due {formatDate(job.deadline)}</span>
          {isUrgent && !isDeadlinePassed && <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Urgent</span>}
        </div>
        
        <div className="job-card-footer">
          <span className="stipend">{stipendDisplay}</span>
          <span className="btn btn-primary btn-small">Apply</span>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;