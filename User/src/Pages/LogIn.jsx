import './Login.css';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Login = () => {
  const { 
    formData, 
    setFormData, 
    login, 
    error, 
    isLoggedIn, 
    isLoading 
  } = useAuth();
  
  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);

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
    try {
      await login();
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const errorMessage = error || localError;
    if (errorMessage) {
      alert(errorMessage);
    }
  }, [error, localError]);

  return (
    <div className="login-container fade-in">
      <div className="sub-container slide-in-right delay-100">
        <form onSubmit={handleSubmit} className="login-form scale-up delay-200">
          <h2 className="form-title slide-in-left delay-300">Login</h2>

          <div className="form-group full-width slide-in-left delay-400">
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

          <div className="form-group full-width slide-in-right delay-500">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />

            <div className="forgot-password fade-in delay-600">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          </div>

          <div className="form-action scale-up delay-700">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="form-footer fade-in delay-800">
            <p>
              Don't have an account? <a href="/signup">Create one</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;