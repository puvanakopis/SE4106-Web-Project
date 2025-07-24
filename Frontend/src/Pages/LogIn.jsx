import './Notifications.css';
import './Login.css';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { 
    formData, 
    setFormData, 
    login, 
    adminLogin,
    error, 
    isLoggedIn, 
    isAdmin,
    isLoading 
  } = useAuth();
  
  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Toast configuration
  const showToast = (message, type = 'error') => {
    const toastOptions = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'toast-message',
      transition: Slide,
    };

    if (type === 'success') {
      toast.success(message, toastOptions);
    } else {
      toast.error(message, toastOptions);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      showToast('Please fill in all fields');
      return;
    }

    try {
      if (isAdminLogin) {
        await adminLogin(formData.email, formData.password);
      } else {
        await login();
      }
      // Removed the success toast here
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setLocalError(errorMessage);
      showToast(errorMessage);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isLoggedIn, navigate, isAdmin]);

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error]);

  return (
    <div className={`login-container ${isAdminLogin ? 'admin-login' : ''}`}>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
      
      <div className="sub-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">
            {isAdminLogin ? 'Admin Login' : 'User Login'}
          </h2>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />

            {!isAdminLogin && (
              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            )}
          </div>
          <div className="form-action">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="toggle-login-type">
            <button 
              type="button" 
              onClick={() => {
                setIsAdminLogin(!isAdminLogin);
                setFormData({ email: '', password: '' });
                setLocalError(null);
              }}
              className="toggle-button"
            >
              {isAdminLogin ? 'Switch to User Login' : 'Switch to Admin Login'}
            </button>
          </div>

          {!isAdminLogin && (
            <div className="form-footer">
              <p>
                Don't have an account? <a href="/signup">Create one</a>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;