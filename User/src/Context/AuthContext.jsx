import { createContext, useState } from 'react';
import puvi from '../Assets/puvi.jpg'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const validUser = {
    email: 'puvanakopis@gmail.com',
    displayName: "Puvanakopis M",
    password: '123456',
    dp: puvi,
  };

  const login = () => {
    const { email, password } = formData;

    if (email === '' || password === '') {
      setError('Email and password are required');
      return;
    }

    if (email === validUser.email && password === validUser.password) {
      setIsLoggedIn(true);
      localStorage.setItem('token', 'fake-jwt-token');
      setError('');
      setFormData({ email: '', password: '' });
    } else {
      setIsLoggedIn(false);
      setError('Invalid email or password');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, formData, setFormData, login, logout, error, validUser }}>
      {children}
    </AuthContext.Provider>
  );
};
