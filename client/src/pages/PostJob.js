// PostJob - companies post new job listings
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: 'remote',
    type: 'internship',
    category: 'tech',
    stipend: '',
    deadline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }
    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }
    if (formData.requirements.length < 10) {
      setError('Requirements must be at least 10 characters');
      return;
    }
    if (!formData.deadline) {
      setError('Deadline is required');
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        stipend: formData.stipend ? parseInt(formData.stipend) : 0
      };
      await createJob(jobData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'company') {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="alert alert-error">Only companies can post jobs.</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Post a New Job</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer Intern"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role and responsibilities..."
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea
              name="requirements"
              className="form-textarea"
              rows="3"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the skills and qualifications needed..."
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                name="location"
                className="form-select"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="internship">Internship</option>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="tech">Tech</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Stipend (₹)</label>
              <input
                type="number"
                name="stipend"
                className="form-input"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="0 for unpaid"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              className="form-input"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;