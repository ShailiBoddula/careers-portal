const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getHeaders(isAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (isAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.detail || `API request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    }),

  // Recruiter Company Profile
  getMyCompany: () =>
    request('/api/company/me', {
      method: 'GET',
      headers: getHeaders(true),
    }),

  updateMyCompany: (data) =>
    request('/api/company/me', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  // Recruiter Career Page Draft
  getCareerPage: () =>
    request('/api/company/me/careers', {
      method: 'GET',
      headers: getHeaders(true),
    }),

  updateCareerPage: (data) =>
    request('/api/company/me/careers', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  publishCareerPage: () =>
    request('/api/company/me/careers/publish', {
      method: 'POST',
      headers: getHeaders(true),
    }),

  unpublishCareerPage: () =>
    request('/api/company/me/careers/unpublish', {
      method: 'POST',
      headers: getHeaders(true),
    }),

  // Recruiter Sections
  getSections: () =>
    request('/api/company/me/sections', {
      method: 'GET',
      headers: getHeaders(true),
    }),

  createSection: (data) =>
    request('/api/company/me/sections', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  updateSection: (id, data) =>
    request(`/api/company/me/sections/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  deleteSection: (id) =>
    request(`/api/company/me/sections/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }),

  reorderSections: (sections) =>
    request('/api/company/me/sections/reorder', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ sections }),
    }),

  // Recruiter Jobs
  getJobs: () =>
    request('/api/company/me/jobs', {
      method: 'GET',
      headers: getHeaders(true),
    }),

  createJob: (data) =>
    request('/api/company/me/jobs', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  updateJob: (id, data) =>
    request(`/api/company/me/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }),

  deleteJob: (id) =>
    request(`/api/company/me/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }),

  // Public Candidate Endpoints
  getPublicCareers: (slug) =>
    request(`/api/public/${slug}/careers`, {
      method: 'GET',
      headers: getHeaders(false),
    }),

  getPublicJobs: (slug, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType) params.append('jobType', filters.jobType);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/api/public/${slug}/jobs${queryString}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
  },

  getPublicJobDetail: (slug, jobId) =>
    request(`/api/public/${slug}/jobs/${jobId}`, {
      method: 'GET',
      headers: getHeaders(false),
    }),
};
