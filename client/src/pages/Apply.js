// Apply - student only, PDF upload and cover note
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applyToJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Apply = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resume, setResume] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'student') {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="alert alert-error">Only students can apply to jobs.</div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.pdf')) {
        setError('Only PDF files are allowed');
        setResume(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setResume(null);
        return;
      }
      setError('');
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      setError('Please upload your resume');
      return;
    }
    if (coverNote.length < 50) {
      setError('Cover note must be at least 50 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await applyToJob(id, coverNote, resume);
      navigate('/my-applications');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Apply to Job</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Resume (PDF only, max 5MB)</label>
            <input
              type="file"
              accept=".pdf"
              className="form-input"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cover Note (min 50 characters)</label>
            <textarea
              className="form-textarea"
              rows="6"
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Tell the company why you're a great fit..."
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              {coverNote.length}/50 characters
            </textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apply;