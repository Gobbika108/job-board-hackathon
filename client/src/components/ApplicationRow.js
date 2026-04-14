// ApplicationRow - shows a single application in a list
import React from 'react';
import StatusBadge from './StatusBadge';
import { API_URL } from '../utils/api';

const ApplicationRow = ({ application }) => {
  const job = application.jobId;
  const companyName = job?.companyId?.name || 'Unknown';
  const title = job?.title || 'Unknown Job';
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return '#';
    if (resumePath.startsWith('http')) return resumePath;
    if (resumePath.startsWith('/api/')) return `${API_URL}${resumePath.replace('/api', '')}`;
    return `${API_URL}/applications/resume/${resumePath}`;
  };

  return (
    <tr>
      <td>{title}</td>
      <td>{companyName}</td>
      <td>{formatDate(application.appliedAt)}</td>
      <td><StatusBadge status={application.status} /></td>
      <td>
        <a 
          href={getResumeUrl(application.resumePath)} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
        >
          View Resume
        </a>
      </td>
    </tr>
  );
};

export default ApplicationRow;