import React, { useState, useEffect } from 'react';
import { assets } from '../../Assets/assets';
import './Feedback.css';

const StarRating = ({ rating, size = 'medium', onRatingChange, editable = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (star) => {
    if (editable) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`star-rating star-rating--${size} ${editable ? 'editable' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star-rating_star ${
            star <= displayRating 
              ? 'star-rating_star--full' 
              : 'star-rating_star--empty'
          } ${editable ? 'clickable' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Feedback = ({
  rating: initialRating = 0,
  editable = false,
  onRatingChange,
  onClose,
  onSubmit,
  feedback: initialFeedback = '',
  onFeedbackChange,
  isSubmitting = false,
  title = "Rate your experience",
  description = "How was your experience?",
  submitText = "Submit",
  cancelText = "Cancel",
  feedbackPlaceholder = "Share your experience (optional)...",
  requiredFeedback = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    setFeedback(initialFeedback);
  }, [initialFeedback]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) onRatingChange(newRating);
  };

  const handleFeedbackChange = (e) => {
    const newFeedback = e.target.value;
    setFeedback(newFeedback);
    if (onFeedbackChange) onFeedbackChange(newFeedback);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating before submitting');
      return;
    }
    
    if (requiredFeedback && !feedback.trim()) {
      alert('Please provide feedback before submitting');
      return;
    }
    
    if (onSubmit) {
      onSubmit({
        rating,
        feedback: feedback.trim(),
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
    if (e.key === 'Enter' && e.ctrlKey && rating > 0) {
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [rating, feedback]);


  if (!editable) {
    return (
      <div className="star-rating-container">
        <StarRating rating={rating} size="medium" />
        {feedback && (
          <div className="feedback-text-display">
            <p>"{feedback}"</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close feedback modal" disabled={isSubmitting}>
            <img src={assets?.closeIcon || '/close-icon.png'} alt="Close" />
          </button>
        </div>

        <div className="feedback-content">
          <p className="feedback-description">{description}</p>
          
          <div className="rating-section">
            <div className="rating-stars-large">
              <StarRating 
                rating={rating} 
                size="large" 
                onRatingChange={handleRatingChange}
                editable={true}
              />
            </div>
            <span className="rating-text">
              {rating === 0 ? 'Select your rating (1-5 stars)' : `You rated: ${rating} out of 5`}
            </span>
          </div>

          <div className="feedback-input-section">
            <label htmlFor="feedback-textarea" className="feedback-label">
              Your Feedback {requiredFeedback && <span className="required">*</span>}
            </label>
            <textarea
              id="feedback-textarea"
              placeholder={feedbackPlaceholder}
              value={feedback}
              onChange={handleFeedbackChange}
              className="feedback-textarea"
              rows={4}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="character-count">
              {feedback.length}/500 characters
            </div>
          </div>
        </div>

        <div className="feedback-actions">
          <button 
            onClick={onClose} 
            className="action-button secondary" 
            disabled={isSubmitting}
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            className="action-button primary"
            disabled={rating === 0 || (requiredFeedback && !feedback.trim()) || isSubmitting}
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Submitting...
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;