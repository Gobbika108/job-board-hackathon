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
  const jobsPerPage = 6;

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

  // Stats
  const totalJobs = filteredJobs.length;
  const remoteJobs = filteredJobs.filter(j => j.location === 'remote').length;
  const internshipJobs = filteredJobs.filter(j => j.type === 'internship').length;
  const closingSoon = filteredJobs.filter(j => {
    const daysLeft = Math.ceil((new Date(j.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 7;
  }).length;

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Find Your Dream Opportunity</h1>
          <p className="hero-subtitle">
            Browse part-time, internship, and full-time roles from top companies.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 20px' }}>
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
                <span className="stat-dot" style={{ background: 'var(--primary)' }}></span>
                <span className="stat-value">{totalJobs}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-badge">
                <span className="stat-dot" style={{ background: '#22c55e' }}></span>
                <span className="stat-value">{remoteJobs}</span>
                <span className="stat-label">Remote</span>
              </div>
              <div className="stat-badge">
                <span className="stat-dot" style={{ background: '#a855f7' }}></span>
                <span className="stat-value">{internshipJobs}</span>
                <span className="stat-label">Internships</span>
              </div>
              <div className="stat-badge">
                <span className="stat-dot" style={{ background: '#f59e0b' }}></span>
                <span className="stat-value">{closingSoon}</span>
                <span className="stat-label">Closing Soon</span>
              </div>
            </div>

            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              Showing {paginatedJobs.length} of {filteredJobs.length} opportunities
            </p>

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
    </div>
  );
};

export default JobList;