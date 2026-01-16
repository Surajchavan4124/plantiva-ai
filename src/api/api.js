import axios from 'axios';

const API_BASE_URL = 'https://plant.vervi.in';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check API
export const checkHealth = () => api.get('/health');

// Plants API
export const createPlant = (plantData) => api.post('/api/plants', plantData);
export const getAllPlants = () => api.get('/api/plants');

// Care Logs API
export const saveCareAdvice = (careData) => api.post('/api/care', careData);

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed in the future
    // config.headers.Authorization = `Bearer ${token}`;
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
