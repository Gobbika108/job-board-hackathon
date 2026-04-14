// Centralized API calls - keeps fetch logic in one place

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { message: text || 'Unexpected server response' };
};

// Generic request wrapper
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// AUTH
export const signup = (userData) => request('/auth/signup', {
  method: 'POST',
  body: JSON.stringify(userData)
});

export const login = (credentials) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

export const googleAuth = ({ credential, role }) => request('/auth/google', {
  method: 'POST',
  body: JSON.stringify({ credential, role })
});

// JOBS
export const getJobs = (filters = {}) => {
  const filteredFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined)
  );
  const params = new URLSearchParams(filteredFilters).toString();
  return request(`/jobs${params ? `?${params}` : ''}`);
};

export const getMyCompanyJobs = () => request('/jobs/mine');

export const getJob = (id) => request(`/jobs/${id}`);

export const createJob = (jobData) => request('/jobs', {
  method: 'POST',
  body: JSON.stringify(jobData)
});

export const deleteJob = (id) => request(`/jobs/${id}`, {
  method: 'DELETE'
});

// APPLICATIONS
export const applyToJob = async (jobId, coverNote, resumeFile) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('jobId', jobId);
  formData.append('coverNote', coverNote);
  formData.append('resume', resumeFile);

  const response = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Application failed');
  }
  return data;
};

export const getMyApplications = () => request('/applications/mine');

export const getJobApplicants = (jobId) => request(`/applications/job/${jobId}`);

export const updateApplicationStatus = (id, status) => request(`/applications/${id}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status })
});