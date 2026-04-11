// StatusBadge - color-coded pill showing application status
import React from 'react';

const StatusBadge = ({ status }) => {
  const statusClass = `status-badge status-${status.replace(' ', '-')}`;
  
  const displayStatus = {
    'applied': 'Applied',
    'under review': 'Under Review',
    'shortlisted': 'Shortlisted',
    'rejected': 'Rejected'
  }[status] || status;

  return (
    <span className={statusClass}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;