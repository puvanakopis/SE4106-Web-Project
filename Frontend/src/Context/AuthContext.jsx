import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === 'admin');
      setIsUser(parsedUser.role === 'student' || parsedUser.role === 'lecturer');
    }
    setLoading(false);
  }, []);


  // ----------- Login -----------
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setIsLoggedIn(true);
      setIsAdmin(data.user.role === 'admin');
      setIsUser(data.user.role === 'student' || data.user.role === 'lecturer');

      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  // ----------- register -----------
  const register = async (formData) => {
    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);

      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setIsLoggedIn(true);
      setIsAdmin(data.user.role === 'admin');
      setIsUser(data.user.role === 'student' || data.user.role === 'lecturer');

      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  // ----------- update Profile -----------
  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const submitData = new FormData();
      if (formData.fullName) submitData.append('fullName', formData.fullName);
      if (formData.displayName) submitData.append('displayName', formData.displayName);
      if (formData.email) submitData.append('email', formData.email);
      if (formData.phone) submitData.append('phone', formData.phone);
      if (formData.address) submitData.append('address', formData.address);

      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Profile update failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };


  // ----------- change Password -----------
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Password change failed');
      }

      return data.message;
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };


  // ----------- delete Account -----------
  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Account deletion failed');
      }

      logout();

      return data.message;
    } catch (error) {
      throw new Error(error.message || 'Account deletion failed');
    } finally {
      setLoading(false);
    }
  };


  // ----------- get Current User -----------
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  // ----------- log out -----------
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      let serverLogoutSuccess = true;

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          serverLogoutSuccess = response.ok && data.success;

          if (!serverLogoutSuccess) {
            console.warn('Server logout failed, but continuing with client logout');
          }
        } catch (error) {
          console.error('Logout API error:', error);
          serverLogoutSuccess = false;
        }
      }

      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setIsUser(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      navigator('./');

      return serverLogoutSuccess;
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      return false;
    }
  };



  // Fetch all owners
  const getOwners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/owners`);
      if (response.data.success) {
        return response.data.owners;
      }
      throw new Error('Failed to fetch owners');
    } catch (err) {
      console.error('Error fetching owners:', err);
      throw new Error(err.response?.data?.message || 'Failed to load owners');
    }
  };

  // Add new owner
  const addOwner = async (ownerData) => {
    try {
      const submitData = new FormData();
      submitData.append('fullName', ownerData.fullName);
      submitData.append('displayName', ownerData.displayName);
      submitData.append('email', ownerData.email);
      submitData.append('phoneNumber', ownerData.phoneNumber);
      submitData.append('address', ownerData.address);
      submitData.append('verified', ownerData.verified);
      submitData.append('status', ownerData.status);
      submitData.append('bankDetails[accountNumber]', ownerData.bankDetails.accountNumber);
      submitData.append('bankDetails[bankName]', ownerData.bankDetails.bankName);
      submitData.append('bankDetails[branch]', ownerData.bankDetails.branch);

      if (ownerData.profile_pic) {
        submitData.append('profile_pic', ownerData.profile_pic);
      }

      const response = await axios.post(`${API_BASE_URL}/owners`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data;
      }
      throw new Error('Failed to add owner');
    } catch (err) {
      console.error('Error adding owner:', err);
      throw new Error(err.response?.data?.message || 'Failed to add owner');
    }
  };

  // Update owner
  const updateOwner = async (ownerId, ownerData) => {
    try {
      const submitData = new FormData();
      submitData.append('fullName', ownerData.fullName);
      submitData.append('displayName', ownerData.displayName);
      submitData.append('email', ownerData.email);
      submitData.append('phoneNumber', ownerData.phoneNumber);
      submitData.append('address', ownerData.address);
      submitData.append('verified', ownerData.verified);
      submitData.append('status', ownerData.status);
      submitData.append('bankDetails[accountNumber]', ownerData.bankDetails.accountNumber);
      submitData.append('bankDetails[bankName]', ownerData.bankDetails.bankName);
      submitData.append('bankDetails[branch]', ownerData.bankDetails.branch);

      if (ownerData.profile_pic) {
        submitData.append('profile_pic', ownerData.profile_pic);
      }

      const response = await axios.put(`${API_BASE_URL}/owners/${ownerId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data;
      }
      throw new Error('Failed to update owner');
    } catch (err) {
      console.error('Error updating owner:', err);
      throw new Error(err.response?.data?.message || 'Failed to update owner');
    }
  };

  // Delete owner
  const deleteOwner = async (ownerId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/owners/${ownerId}`);
      if (response.data.success) {
        return response.data;
      }
      throw new Error('Failed to delete owner');
    } catch (err) {
      console.error('Error deleting owner:', err);
      throw new Error(err.response?.data?.message || 'Failed to delete owner');
    }
  };

  // Update owner status
  const updateOwnerStatus = async (ownerId, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/owners/${ownerId}`, {
        status: status
      });

      if (response.data.success) {
        return response.data;
      }
      throw new Error('Failed to update owner status');
    } catch (err) {
      console.error('Error updating owner status:', err);
      throw new Error(err.response?.data?.message || 'Failed to update owner status');
    }
  };


  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      isAdmin,
      isUser,
      loading,
      login,
      register,
      updateProfile,
      changePassword,
      deleteAccount,
      logout,
      getCurrentUser,

      // Owner management functions
      getOwners,
      addOwner,
      updateOwner,
      deleteOwner,
      updateOwnerStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};