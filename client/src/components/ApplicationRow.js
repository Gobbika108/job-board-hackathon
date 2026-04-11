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
    <tr>
      <td>{title}</td>
      <td>{companyName}</td>
      <td>{formatDate(application.appliedAt)}</td>
      <td><StatusBadge status={application.status} /></td>
    </tr>
  );
};

export default ApplicationRow;