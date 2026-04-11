// JobCard - display a job as a clickable card with badges
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const isDeadlinePassed = new Date(job.deadline) < new Date();
  const companyName = job.companyId?.name || 'Unknown Company';
  const stipendDisplay = job.stipend ? `$${job.stipend.toLocaleString()}` : 'Unpaid';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card">
      <Link to={`/jobs/${job._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
        <div className="job-card-title">{job.title}</div>
        <div className="job-card-company">{companyName}</div>
        
        <div className="job-card-meta">
          <span className={`badge badge-${job.location}`}>
            {job.location}
          </span>
          <span className={`badge badge-${job.type}`}>
            {job.type}
          </span>
          <span className={`badge badge-${job.category}`}>
            {job.category}
          </span>
        </div>
        
        <div className="job-card-meta">
          <span>{stipendDisplay}</span>
          
          {isDeadlinePassed ? (
            <span className="badge badge-deadline">Deadline passed</span>
          ) : (
            <span>Due: {formatDate(job.deadline)}</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default JobCard;