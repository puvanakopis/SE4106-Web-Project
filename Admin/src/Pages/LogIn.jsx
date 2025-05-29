import './Login.css';
import { AuthContext } from '../Context/AuthContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const { formData, setFormData, login, error, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    login(); 
  };

  // If logged in, redirect to home page
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);


  //Show alert if login fails
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);


  
  return (
    <div className="form-container">
      <div className="sub-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Log In</h2>

          <div className="form-group full-width">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-action">
            <button type="submit">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
