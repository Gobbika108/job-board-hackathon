// JobList - main jobs page with enhanced UI
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

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Find Your Dream Opportunity</h1>
          <p className="hero-subtitle">
            Browse hundreds of part-time, internship, and full-time opportunities from top companies. 
            Apply with your resume and land your next big role.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 20px' }}>
        <FilterBar filters={filters} onChange={setFilters} />

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state card">
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No jobs found</p>
            <p>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
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