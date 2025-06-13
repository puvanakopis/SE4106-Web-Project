import './Login.css';
import { AuthContext } from '../Context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { formData, setFormData, login, error, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login();
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // alert if login fails
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    // --------------------- Main container ---------------------
    <div className="login-container">

      {/* --------------------- Sub-container --------------------- */}
      <div className="sub-container">

        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Login</h2>

          {/* Email input field */}
          <div className="form-group full-width">
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

          {/* Password input field */}
          <div className="form-group full-width">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />

            {/* Forgot password link */}
            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          </div>

          {/* Submit button */}
          <div className="form-action">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {/* Link to signup page */}
          <div className="form-footer">
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