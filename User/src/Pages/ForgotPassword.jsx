import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';
import './Notifications.css';

const ForgotPassword = () => {
  // State Management
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Toast configuration (same as SignUp component)
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

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      showToast('error', 'Please enter a valid email address');
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setError('');

    try {
      // Replace setTimeout with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('success', 'Password reset link sent to your email!');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to send reset link');
      showToast('error', 'Failed to send reset link. Please try again.');
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="forgot-password-container fade-in">
      {/* Toast Container (same as SignUp component) */}
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
      
      <div className="forgot-password-card slide-in-right delay-100">
        {!isSubmitted ? (
          // Form State
          <>
            <h2 className="forgot-password-title slide-in-left delay-200">Forgot Password</h2>

            <p className="forgot-password-subtitle fade-in delay-300">
              Enter your email address and we'll send you a link to reset your password
            </p>

            {error && <div className="forgot-password-error scale-up">{error}</div>}

            <form onSubmit={handleSubmit} className="forgot-password-form scale-up delay-400">
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

            <div className="forgot-password-footer fade-in delay-700">
              <p>
                Remember your password?{' '}
                <a href="/login" className="text-link">Log in</a>
              </p>
            </div>
          </>
        ) : (
          // Success State
          <div className="success-message">
            <h2 className="success-title slide-in-left delay-200">Check Your Email</h2>
            
            <div className="success-icon scale-up delay-300">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
              </svg>
            </div>
            
            <p className="success-text fade-in delay-400">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <p className="success-note fade-in delay-500">
              If you don't see the email, check your spam folder.
            </p>
            
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