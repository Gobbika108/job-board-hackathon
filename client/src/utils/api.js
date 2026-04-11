// Centralized API calls - keeps fetch logic in one place

const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

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

  const data = await response.json();

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

// JOBS
export const getJobs = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return request(`/jobs${params ? `?${params}` : ''}`);
};

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

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(text || 'Application failed');
  }
  
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