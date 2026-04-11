// ApplicationRow - shows a single application in a list
import React from 'react';
import StatusBadge from './StatusBadge';

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

  return (
    <div className="application-row">
      <div>{title}</div>
      <div>{companyName}</div>
      <div>{formatDate(application.appliedAt)}</div>
      <StatusBadge status={application.status} />
    </div>
  );
};

export default ApplicationRow;