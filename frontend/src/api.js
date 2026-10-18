import axios from 'axios';

// Axios instance pointing at Express backend
// When using Vite proxy, /api/* → http://localhost:5000/api/*
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach JWT from localStorage ───────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — extract data or throw readable error ──────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Auto-logout if the server returns 401 (token expired / invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Reload to kick the user back to the login screen
      window.location.reload();
    }

    return Promise.reject(new Error(message));
  }
);

// ─── Auth API helpers ─────────────────────────────────────────────────────────
export const authApi = {
  /** POST /api/auth/register */
  register: (data) => api.post('/auth/register', data),

  /** POST /api/auth/login */
  login: (data) => api.post('/auth/login', data),
};

// ─── Task API helpers ─────────────────────────────────────────────────────────
export const taskApi = {
  /** GET /api/tasks */
  getAll: () => api.get('/tasks'),

  /** GET /api/tasks/:id */
  getOne: (id) => api.get(`/tasks/${id}`),

  /** POST /api/tasks */
  create: (data) => api.post('/tasks', data),

  /** PUT /api/tasks/:id */
  update: (id, data) => api.put(`/tasks/${id}`, data),

  /** DELETE /api/tasks/:id */
  remove: (id) => api.delete(`/tasks/${id}`),
};

export default api;
