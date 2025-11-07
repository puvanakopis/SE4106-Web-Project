import './Login.css';
import { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const navigate = useNavigate();

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login, loading } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const user = await login(formData.email, formData.password);

      if ((isAdminLogin && user.role !== 'admin') || (!isAdminLogin && user.role === 'admin')) {
        toast.warning(`Please use the ${user.role} login portal`);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      toast.success(`Welcome back, ${user.name || user.email}!`);

      navigate('/');

    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleToggleLoginType = () => {
    setIsAdminLogin(!isAdminLogin);
    setFormData({ email: '', password: '' });
    toast.info(`Switched to ${!isAdminLogin ? 'Admin' : 'User'} Login`);
  };

  const handleForgotPasswordClick = () => {
    toast.info('Redirecting to password recovery...');
    navigate('/forgot-password');
  };

  const handleSignupClick = () => {
    toast.info('Redirecting to signup...');
    navigate('/signup');
  };

  return (
    <div className={`login-container ${isAdminLogin ? 'admin-login' : ''}`}>
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
                <a
                  href="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPasswordClick();
                    navigate('/forgot-password');
                  }}
                >
                  Forgot Password?
                </a>
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
              onClick={handleToggleLoginType}
              className="toggle-button"
            >
              {isAdminLogin ? 'Switch to User Login' : 'Switch to Admin Login'}
            </button>
          </div>

          {!isAdminLogin && (
            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <a
                  href="/signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSignupClick();
                    navigate('/signup');
                  }}
                >
                  Create one
                </a>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;