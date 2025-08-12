import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const user = await login(formData.email, formData.password);
      
      // Check if user is trying to access correct portal
      if ((isAdminLogin && user.role !== 'admin') || (!isAdminLogin && user.role === 'admin')) {
        setError(`Please use the ${user.role} login portal`);
        return;
      }

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className={`login-container ${isAdminLogin ? 'admin-login' : ''}`}>
      <div className="sub-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">
            {isAdminLogin ? 'Admin Login' : 'User Login'}
          </h2>

          {error && <div className="error-message">{error}</div>}

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
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="toggle-login-type">
            <button 
              type="button" 
              onClick={() => {
                setIsAdminLogin(!isAdminLogin);
                setFormData({ email: '', password: '' });
                setError(null);
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