import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// User login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Admin login failed');
  }
};

// User registration
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    for (const key in userData) {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    }
    
    const response = await api.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Get profile (works for both users and admins)
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profile');
  }
};