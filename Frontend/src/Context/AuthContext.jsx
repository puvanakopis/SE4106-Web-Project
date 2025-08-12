import { createContext, useState, useEffect } from 'react';
import puvi from '../Assets/puvi.jpg';
import adminIcon from '../Assets/puvi.jpg';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Updated user data
  const sampleUsers = [
    {
      id: "student_01",
      displayName: "Puvanakopis",
      phone: "+94771234567",
      email: 'puvanakopis@gmail.com',
      role: "student",
      fullName: "Mehanathan Puvanakopis",
      PhoneNumber: "0774584052",
      address: "No. 65, Main Street, Pambahinna, Balangoda",
      createDate: "2025-06-17",
      password: '123456',
      dp: puvi
    },
    {
      id: "lecturer_01",
      displayName: "Puvi",
      phone: "+94771234567",
      email: 'puvanakopis1@gmail.com',
      role: "lecturer",
      fullName: "Mehanathan Puvanakopis",
      PhoneNumber: "0774584052",
      address: "No. 65, Main Street, Pambahinna, Balangoda",
      createDate: "2025-06-17",
      password: '123456',
      dp: puvi
    },
    {
      id: "admin_01",
      displayName: "Admin",
      phone: "+94771234567",
      email: 'admin@gmail.com',
      role: "admin",
      fullName: "Admin User",
      PhoneNumber: "0774584052",
      address: "Admin Address",
      createDate: "2025-06-17",
      password: '123456',
      dp: adminIcon
    }
  ];

  useEffect(() => {
    // Check for existing session on initial load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        const foundUser = sampleUsers.find(
          user => user.email === email && user.password === password
        );

        if (foundUser) {
          setUser(foundUser);
          setIsLoggedIn(true);
          setIsAdmin(foundUser.role === 'admin');
          localStorage.setItem('token', 'fake-jwt-token');
          localStorage.setItem('user', JSON.stringify(foundUser));
          resolve(foundUser);
        } else {
          reject(new Error('Invalid email or password'));
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      isAdmin,
      loading,
      login,
      logout,
      sampleUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};