import axios from 'axios';

// In dev, Vite proxies /api to localhost:5000 (see vite.config.js), so the
// relative path works with no env var needed. In production, set
// VITE_API_URL to your deployed backend's URL (e.g. https://your-api.onrender.com/api).
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('unilibrary_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

