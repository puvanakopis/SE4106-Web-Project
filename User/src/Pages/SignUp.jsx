import React, { useState } from 'react';
import './SignUp.css';
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
  });

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
      alert("Passwords don't match!");
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
        // Registration successful
        console.log('Registration successful:', result);
        // Redirect or show success message
      } else {
        // Registration failed
        console.error('Registration failed:', result.error);
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    // Main container with fade-in animation
    <div className="signup-container fade-in">

      {/* Sub-container with slide-in-right animation */}
      <div className="sub-container slide-in-right delay-100">

        {/* Signup form with scale-up animation */}
        <form onSubmit={handleSubmit} className="signup-form scale-up delay-200">

          {/* Form title with slide-in-left animation */}
          <h2 className="form-title slide-in-left delay-300">Sign Up</h2>

          {/* Input fields grid */}
          <div className="form-grid">
            {/* First Name - slide-in-left */}
            <div className="form-group slide-in-left delay-400">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name - slide-in-right */}
            <div className="form-group slide-in-right delay-400">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>

            {/* Email Address - slide-in-left */}
            <div className="form-group slide-in-left delay-500">
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

            {/* Mobile Number - slide-in-right */}
            <div className="form-group slide-in-right delay-500">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Address - slide-in-left (full width) */}
            <div className="form-group full-width slide-in-left delay-600">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
              />
            </div>

            {/* Password - slide-in-right */}
            <div className="form-group slide-in-right delay-600">
              <label>Password</label>
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

            {/* Confirm Password - slide-in-left */}
            <div className="form-group slide-in-left delay-700">
              <label>Confirm Password</label>
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

          {/* Profile Photo Upload - fade-in */}
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

          {/* Submit Button - scale-up */}
          <div className="form-action scale-up delay-900">
            <button type="submit">Sign Up</button>
          </div>

          {/* Footer: Login Link - fade-in */}
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