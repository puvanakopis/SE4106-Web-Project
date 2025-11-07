import React, { useState, useContext } from 'react';
import './SignUp.css';
import upload_area from '../Assets/upload_area.png';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [image, setImage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: null,
    role: 'student',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      
      if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="sub-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="form-title">Sign Up</h2>

          {error && <div className="error-message">{error}</div>}

          {/* Role Selection */}
          <div className="form-group">
            <label>Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-dropdown"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          {/* Name and Email Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password and Confirm Password Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                minLength="6"
              />
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div className="form-group">
            <label>Profile Photo</label>
            <label htmlFor="file-input" className="uploadProfile">
              <img
                src={image ? URL.createObjectURL(image) : upload_area}
                alt="Profile preview"
                className="profile-image-preview"
              />
            </label>
            <input
              type="file"
              id="file-input"
              onChange={imageHandler}
              accept="image/*"
              hidden
            />
          </div>

          {/* Submit Button */}
          <div className="form-action">
            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {/* Login Link */}
          <div className="form-footer">
            <p>
              Have An Account? <a href="/login">Log In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;