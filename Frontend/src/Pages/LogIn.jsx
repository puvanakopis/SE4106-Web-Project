import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    // State data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });


    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Data:', formData);
    };

    return (
        <div className="form-container">
            <div className="sub-container">

                {/* Login form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Form Title */}
                    <h2 className="form-title">Log In</h2>

                    {/* Email input field */}
                    <div className="form-group full-width">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* Password input field */}
                    <div className="form-group full-width">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    {/* Sign up link */}
                    <div className="form-footer">
                        <p>
                            Don't Have an Account? <a href='/signup'> Sign Up</a>
                        </p>
                    </div>

                    {/* Submit button */}
                    <div className="form-action">
                        <button type="submit" >Log In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;