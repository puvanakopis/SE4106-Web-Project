import axios from 'axios';

const API_URL = 'http://localhost:5000/api/owners';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Create owner
export const createOwner = async (formData) => {
  try {
    const response = await api.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create owner');
  }
};

// Get all owners
export const getAllOwners = async (search = '') => {
  try {
    const response = await api.get(`/?search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch owners');
  }
};

// Get owner by ID
export const getOwnerById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch owner');
  }
};

// Update owner
export const updateOwner = async (id, formData) => {
  try {
    const response = await api.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update owner');
  }
};

// Delete owner
export const deleteOwner = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete owner');
  }
};

// Get owner statistics
export const getOwnerStats = async () => {
  try {
    const response = await api.get('/stats/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch owner statistics');
  }
};