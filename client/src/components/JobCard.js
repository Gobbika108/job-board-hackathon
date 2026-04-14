// JobCard - premium modern job card component
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const isDeadlinePassed = new Date(job.deadline) < new Date();
  const companyName = job.companyId?.name || 'Company';
  const companyInitial = companyName.charAt(0).toUpperCase();
  const stipendDisplay = job.stipend ? `₹${job.stipend.toLocaleString()}` : 'Unpaid';
  
  const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft > 0 && daysLeft <= 3;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'internship': return 'Internship';
      case 'part-time': return 'Part-time';
      case 'full-time': return 'Full-time';
      default: return type;
    }
  };

  return (
    <div className="job-card">
      <Link to={`/jobs/${job._id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
        <div className="job-card-inner">
          <div className="job-card-header">
            <div className="company-logo">{companyInitial}</div>
            <div style={{ flex: 1 }}>
              <div className="job-card-badges">
                <span className={`badge badge-${job.type}`}>
                  {getTypeLabel(job.type)}
                </span>
                <span className={`badge badge-${job.location}`}>
                  {job.location === 'remote' ? 'Remote' : 'On-site'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-company">{companyName}</div>
          
          <div className="job-card-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Due {formatDate(job.deadline)}
            </span>
            {isUrgent && !isDeadlinePassed && <span style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.75rem' }}>Urgent</span>}
          </div>
          
          <div className="job-card-footer">
            <span className="stipend">{stipendDisplay}</span>
            <span className="btn btn-primary btn-small">View</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;