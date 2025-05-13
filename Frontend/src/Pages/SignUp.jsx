import React, { useState } from 'react';
import './Login.css';
import upload_area from '../Assets/upload_area.png';

const SignUp = () => {
  const [image, setImage] = useState(false)
        const imageHandler = (e) => {
        setImage(e.target.files[0])
    }
    // State data
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


    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="form-container">
            <div className="sub-container">

                {/* Sign form */}
                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Form Title */}
                    <h2 className="form-title">Sign Up</h2>

                    <div className="form-grid">

                        {/* first Name input field */}
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" onChange={handleChange} />
                        </div>

                        {/* last Name input field */}
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" onChange={handleChange} />
                        </div>

                        {/* email input field */}
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" onChange={handleChange} />
                        </div>

                        {/* Mobile Number input field */}
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="text" name="mobile" onChange={handleChange} />
                        </div>

                        {/* Address input field */}
                        <div className="form-group full-width">
                            <label>Address</label>
                            <input type="text" name="address" onChange={handleChange} />
                        </div>

                        {/* Password input field */}
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" onChange={handleChange} />
                        </div>
                    </div>

                    {/* Profile Photo input field */}
                    <div className="form-group full-width">
                        <label>Profile Photo</label>
                        <label className='uploadProfile' htmlFor="file-input">
                            <img src={image ? URL.createObjectURL(image) : upload_area} alt="" />
                        </label>

                        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />

                    </div>

                    {/* Log In link */}
                    <div className="form-footer">
                        <p>
                            Have An Account? <a href="/login">Log In</a>
                        </p>
                    </div>

                    {/* Submit button */}
                    <div className="form-action">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;