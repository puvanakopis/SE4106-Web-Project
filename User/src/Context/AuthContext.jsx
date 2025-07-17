import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getProfile, loginAdmin } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: '',
    confirmPassword: '',
    address: '',
    photo: null
  });
  const [isLoading, setIsLoading] = useState(false); 
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); 

  // Run once on initial load to check if a token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    }
  }, []);

  // Verify token by calling the profile endpoint
  const verifyToken = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.role === 'admin');
    } catch (error) {
      console.error('Token verification failed:', error);
      setError('Your session has expired. Please log in again.');
      logout(); 
    }
  };

  // Handle user login
  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { email, password } = formData;
      const response = await loginUser(email, password);

      localStorage.setItem('token', response.token); 
      setUser(response.user);
      setIsLoggedIn(true);
      setIsAdmin(false);
      setFormData(prev => ({ ...prev, password: '' }));
      navigate('/'); 
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false); 
    }
  };

  // Handle admin login
  const adminLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginAdmin(email, password);

      localStorage.setItem('token', response.token); 
      setUser(response.admin);
      setIsLoggedIn(true);
      setIsAdmin(true);
      navigate('/admin'); 
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(formData);

      localStorage.setItem('token', response.token); 
      setUser(response.user);
      setIsLoggedIn(true);
      setIsAdmin(false);
      setFormData(prev => ({ 
        ...prev,
        password: '',
        confirmPassword: '',
        photo: null
      }));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Log the user out and clear all data
  const logout = () => {
    localStorage.removeItem('token'); 
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login'); 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        error,
        formData,
        setFormData,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};