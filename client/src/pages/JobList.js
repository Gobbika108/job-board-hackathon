// JobList - main jobs page with premium UI
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
  const jobsPerPage = 9;

  useEffect(() => {
    loadJobs();
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search && filters.search.length > 0) {
        loadJobs();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

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

  const filteredJobs = jobs.filter(job => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    const companyName = (job.companyId?.name || '').toLowerCase();
    return job.title.toLowerCase().includes(searchLower) || 
           companyName.includes(searchLower);
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  const remoteJobs = filteredJobs.filter(j => j.location === 'remote').length;
  const internshipJobs = filteredJobs.filter(j => j.type === 'internship').length;

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Open Positions</h1>
          <p className="hero-subtitle">
            {filteredJobs.length} jobs available
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 20px 3rem' }}>
        <FilterBar filters={filters} onChange={setFilters} />

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state card">
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No jobs found</p>
            <p>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-badge">
                <span className="stat-dot" style={{ background: '#64748b' }}></span>
                <span className="stat-value">{filteredJobs.length}</span>
                <span className="stat-label">positions</span>
              </div>
              <div className="stat-badge">
                <span className="stat-dot" style={{ background: '#22c55e' }}></span>
                <span className="stat-value">{remoteJobs}</span>
                <span className="stat-label">remote</span>
              </div>
              <div className="stat-badge">
                <span className="stat-dot" style={{ background: '#f59e0b' }}></span>
                <span className="stat-value">{internshipJobs}</span>
                <span className="stat-label">internships</span>
              </div>
            </div>

            <div className="job-grid">
              {paginatedJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    className={pageNum === page ? 'active' : ''}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobList;