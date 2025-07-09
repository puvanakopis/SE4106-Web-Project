import './Login.css';
import { AuthContext } from '../Context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  // ------------------ Context & State ------------------
  const { formData, setFormData, login, error, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // ------------------ Handler Functions ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login();
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------ Effect Hooks ------------------
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // ------------------ Render ------------------
  return (
    /* Main container with fade-in animation */
    <div className="login-container fade-in">
      
      {/* Sub-container with slide-in-right animation */}
      <div className="sub-container slide-in-right delay-100">

        {/* Login form with scale-up animation */}
        <form onSubmit={handleSubmit} className="login-form scale-up delay-200">
          <h2 className="form-title slide-in-left delay-300">Login</h2>

          {/* Email input field */}
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

          {/* Password input field */}
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

            {/* Forgot password link */}
            <div className="forgot-password fade-in delay-600">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          </div>

          {/* Submit button */}
          <div className="form-action scale-up delay-700">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {/* Link to signup page */}
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