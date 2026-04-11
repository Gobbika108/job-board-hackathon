// JobList - main jobs page with filters, search, pagination
import React, { useState, useEffect } from 'react';
import { getJobs } from '../utils/api';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJobs(filters);
      setJobs(data);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search (filters by title or company name)
  const filteredJobs = jobs.filter(job => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    const companyName = (job.companyId?.name || '').toLowerCase();
    return job.title.toLowerCase().includes(searchLower) || 
           companyName.includes(searchLower);
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Find Your Next Opportunity</h1>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="job-grid">
            {paginatedJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={pageNum === page ? 'active' : ''}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;