import React, { useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css';
import './Notifications.css'
import upload_area from '../Assets/upload_area.png';

const SignUp = () => {
  const [image, setImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    photo: null,
    role: 'student',
  });

  // Toast configuration
  const showToast = (type, message) => {
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

    if (formData.password !== formData.confirmPassword) {
      showToast('error', "Passwords don't match!");
      return;
    }

    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    data.append('password', formData.password);
    data.append('confirmPassword', formData.confirmPassword);
    data.append('address', formData.address);
    data.append('role', formData.role);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        showToast('success', 'Registration successful!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          address: '',
          photo: null,
          role: 'student',
        });
        setImage(false);
      } else {
        showToast('error', result.error || 'Registration failed');
      }
    } catch (error) {
      showToast('error', 'An error occurred during registration');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="signup-container fade-in">
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
      <div className="sub-container slide-in-right delay-100">
        <form onSubmit={handleSubmit} className="signup-form scale-up delay-200">
          <h2 className="form-title slide-in-left delay-300">Sign Up</h2>

          <div className="form-grid">
            {/* Role Selection */}
            <div className="form-group full-width slide-in-left delay-400">
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

            {/* First Name */}
            <div className="form-group slide-in-left delay-400">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div className="form-group slide-in-right delay-400">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>

            {/* Email */}
            <div className="form-group slide-in-left delay-500">
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

            {/* Mobile */}
            <div className="form-group slide-in-right delay-500">
              <label>Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Address */}
            <div className="form-group full-width slide-in-left delay-600">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
              />
            </div>

            {/* Password */}
            <div className="form-group slide-in-right delay-600">
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

            {/* Confirm Password */}
            <div className="form-group slide-in-left delay-700">
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
          <div className="form-group fade-in delay-800">
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
          <div className="form-action scale-up delay-900">
            <button type="submit">Sign Up</button>
          </div>

          {/* Login Link */}
          <div className="form-footer fade-in delay-1000">
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