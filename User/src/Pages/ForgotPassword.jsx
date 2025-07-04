import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  // ------------------ State Management ------------------
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ------------------ Form Submission Handler ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    /* ------------------ Main Container ------------------ */
    <div className="forgot-password-container fade-in">
      
      {/* ------------------ Card Container ------------------ */}
      <div className="forgot-password-card slide-in-right delay-100">
        {!isSubmitted ? (
          /* ------------------ Form State ------------------ */
          <>
            {/* ------------------ Title Section ------------------ */}
            <h2 className="forgot-password-title slide-in-left delay-200">Forgot Password</h2>

            {/* ------------------ Subtitle Section ------------------ */}
            <p className="forgot-password-subtitle fade-in delay-300">
              Enter your email address and we'll send you a link to reset your password
            </p>

            {/* ------------------ Error Message ------------------ */}
            {error && <div className="forgot-password-error scale-up">{error}</div>}

            {/* ------------------ Form Elements ------------------ */}
            <form onSubmit={handleSubmit} className="forgot-password-form scale-up delay-400">
              {/* ------------------ Email Input ------------------ */}
              <div className="form-group slide-in-left delay-500">
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

              {/* ------------------ Submit Button ------------------ */}
              <button
                type="submit"
                className="submit-button scale-up delay-600"
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

            {/* ------------------ Footer Links ------------------ */}
            <div className="forgot-password-footer fade-in delay-700">
              <p>
                Remember your password?{' '}
                <a href="/login" className="text-link">Log in</a>
              </p>
            </div>
          </>
        ) : (
          /* ------------------ Success State ------------------ */
          <div className="success-message">
            {/* ------------------ Success Title ------------------ */}
            <h2 className="success-title slide-in-left delay-200">Check Your Email</h2>
            
            {/* ------------------ Success Icon ------------------ */}
            <div className="success-icon scale-up delay-300">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
              </svg>
            </div>
            
            {/* ------------------ Success Message ------------------ */}
            <p className="success-text fade-in delay-400">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            {/* ------------------ Additional Note ------------------ */}
            <p className="success-note fade-in delay-500">
              If you don't see the email, check your spam folder.
            </p>
            
            {/* ------------------ Back Button ------------------ */}
            <button
              className="back-button slide-in-right delay-600"
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