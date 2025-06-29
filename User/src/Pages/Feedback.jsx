import React, { useState, useEffect } from 'react';
import { assets } from '../Assets/assets';
import './Feedback.css';

const StarRating = ({ rating, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`star-rating star-rating--${size}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star-rating_star star-rating_star--full">★</span>
      ))}
      {hasHalfStar && <span className="star-rating_star star-rating_star--half">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star-rating_star star-rating_star--empty">★</span>
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
  feedbackPlaceholder = "Share your experience (optional)",
  showEmojis = true,
  showTips = false,
  requiredFeedback = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

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

  const handleSubmit = () => {
    if (requiredFeedback && !feedback.trim()) {
      alert('Please provide feedback before submitting');
      return;
    }
    
    if (onSubmit) {
      onSubmit({
        rating,
        feedback,
        emoji: selectedEmoji
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayRating = hoverRating || rating;

  if (!editable) {
    return (
      <div className="star-rating-container">
        <StarRating rating={rating} size="medium" />
      </div>
    );
  }

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close feedback modal">
            <img src={assets?.closeIcon} alt="Close" />
          </button>
        </div>

        <div className="feedback-content">
          <p className="feedback-description">{description}</p>
          
          <div className="rating-section">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= displayRating ? 'filled' : ''}`}
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="rating-text">
              {rating === 0 ? 'Select rating' : `${rating} out of 5`}
            </span>
          </div>

          {showEmojis && (
            <div className="emoji-section">
              <p>How would you describe your experience?</p>
              <div className="emoji-container">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className={`emoji-btn ${selectedEmoji === emoji.label ? 'selected' : ''}`}
                    onClick={() => setSelectedEmoji(emoji.label)}
                    aria-label={emoji.label}
                  >
                    <span className="emoji-icon">{emoji.icon}</span>
                    <span className="emoji-label">{emoji.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="feedback-input-section">
            <textarea
              placeholder={feedbackPlaceholder}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                if (onFeedbackChange) onFeedbackChange(e.target.value);
              }}
              className="feedback-textarea"
              rows={4}
            />
            {showTips && (
              <div className="feedback-tips">
                <p>Tips for great feedback:</p>
                <ul>
                  <li>What did you like most?</li>
                  <li>What could be improved?</li>
                  <li>Would you recommend to others?</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="feedback-actions">
          <button onClick={onClose} className="action-button secondary" disabled={isSubmitting}>
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            className="action-button primary"
            disabled={rating === 0 || (requiredFeedback && !feedback.trim()) || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

const emojis = [
  { icon: '😞', label: 'Poor' },
  { icon: '😐', label: 'Average' },
  { icon: '😊', label: 'Good' },
  { icon: '😍', label: 'Excellent' }
];

export default Feedback;