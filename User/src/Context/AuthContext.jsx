import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getProfile } from '../api/auth';

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
      setFormData(prev => ({ ...prev, password: '' }));
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
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
      setFormData(prev => ({ 
        ...prev,
        password: '',
        confirmPassword: '',
        photo: null
      }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Log the user out and clear all data
  const logout = () => {
    localStorage.removeItem('token'); 
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login'); 
  };

  // Provide all values and methods to consuming components
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        error,
        formData,
        setFormData,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};