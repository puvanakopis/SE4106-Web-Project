import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');           
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);     
  const [error, setError] = useState('');
  const navigate = useNavigate();                

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulate request
    setIsLoading(true);
    setError('');

    // Simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {!isSubmitted ? (
          <>
            {/* Title */}
            <h2 className="forgot-password-title">Forgot Password</h2>

            {/* Subtitle */}
            <p className="forgot-password-subtitle">
              Enter your email address and we'll send you a link to reset your password
            </p>

            {/* Error message */}
            {error && <div className="forgot-password-error">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                  className={error ? 'input-error' : ''}
                />
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {/* Footer with login link */}
            <div className="forgot-password-footer">
              <p>
                Remember your password?{' '}
                <a href="/login" className="text-link">Log in</a>
              </p>
            </div>
          </>
        ) : (
          // Success message shown after form is submitted
          <div className="success-message">
            <h2 className="success-title">Check Your Email</h2>
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            </div>
            <p className="success-text">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-note">
              If you don't see the email, check your spam folder.
            </p>
            <button 
              className="back-button"
              onClick={() => navigate('/login')}
            >
              Back to Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
