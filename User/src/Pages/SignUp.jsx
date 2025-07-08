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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    // --------------------- Main Container ---------------------
    <div className="signup-container">
      
      {/* --------------------- Sub Container --------------------- */}
      <div className="sub-container">
        
        {/* --------------------- Signup Form --------------------- */}
        <form onSubmit={handleSubmit} className="signup-form">
          
          {/*  Form Title  */}
          <h2 className="form-title">Sign Up</h2>

          {/*  Input Fields Grid  */}
          <div className="form-grid">
            {/*  First Name  */}
            <div className="form-group">
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

            {/*  Last Name  */}
            <div className="form-group">
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

            {/*  Email Address  */}
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

            {/*  Mobile Number  */}
            <div className="form-group">
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

            {/*  Address  */}
            <div className="form-group full-width">
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

            {/*  Password  */}
            <div className="form-group">
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

            {/*  Confirm Password  */}
            <div className="form-group">
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

          {/*  Profile Photo Upload  */}
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

          {/*  Submit Button  */}
          <div className="form-action">
            <button type="submit">Sign Up</button>
          </div>

          {/*  Footer: Login Link  */}
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
