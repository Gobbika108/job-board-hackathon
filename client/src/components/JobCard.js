// JobCard - enhanced job display component
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const isDeadlinePassed = new Date(job.deadline) < new Date();
  const companyName = job.companyId?.name || 'Unknown Company';
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
    <div className="card card-hover">
      <Link to={`/jobs/${job._id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div className="job-card-title" style={{ flex: 1 }}>{job.title}</div>
          {isUrgent && !isDeadlinePassed && (
            <span className="badge badge-deadline" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>Urgent</span>
          )}
        </div>
        
        <div className="job-card-company" style={{ fontWeight: '500' }}>
          {companyName}
        </div>
        
        <div className="job-card-meta">
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
        
        <div className="job-card-meta" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{stipendDisplay}</span>
            
            {isDeadlinePassed ? (
              <span className="badge badge-deadline">Closed</span>
            ) : (
              <span style={{ color: isUrgent ? 'var(--danger)' : 'var(--muted)', fontWeight: isUrgent ? '600' : '400', fontSize: '0.85rem' }}>
                {daysLeft > 0 ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : 'Due today'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;