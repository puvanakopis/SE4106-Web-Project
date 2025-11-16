import React from 'react';
import { assets } from '../../Assets/assets';
import './OwnerDetails.css';
import StarRating from '../../Components/Rating/StarRating';

const OwnerDetails = ({ owner, onClose }) => {
  if (!owner) return null;

  // Safe property access with fallbacks
  const displayName = owner.displayName || owner.fullName || 'Owner';
  const email = owner.email || 'No email provided';
  const phoneNumber = owner.phoneNumber || owner.PhoneNumber || 'No phone number provided';
  const address = owner.address || owner.Address || 'No address provided';
  const memberSince = owner.accountCreatedDate || owner.accontCretDate || 'Not specified';
  const rating = owner.averageRating || 0;
  const totalReviews = owner.totalReviews || 0;
  const role = owner.role || 'Vehicle Owner';

  // Handle profile picture with proper URL construction
  const getProfilePicture = () => {
    if (owner.profile_pic) {
      // If it's already a full URL, return as is
      if (owner.profile_pic.startsWith('http')) {
        return owner.profile_pic;
      }
      // If it starts with /uploads, construct full URL
      if (owner.profile_pic.startsWith('/uploads')) {
        return `http://localhost:5000${owner.profile_pic}?t=${Date.now()}`;
      }
      // Otherwise, assume it's just a filename and construct path
      return `http://localhost:5000/uploads/${owner.profile_pic}?t=${Date.now()}`;
    }
    // Fallback to avatar API
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`;
  };

  const handleImageError = (e) => {
    console.error('Failed to load owner image:', e.target.src);
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`;
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <div className="owner-modal-overlay">
      <div className="owner-modal">
        <div className="owner-modal-header">
          <h2>Owner Details</h2>
          <button className="close-button" onClick={onClose}>
            <img 
              src={assets.closeIcon} 
              alt="Close" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </button>
        </div>

        <div className="owner-profile-section">
          <div className="owner-avatar-container">
            <img
              src={getProfilePicture()}
              alt={displayName}
              className="owner-avatar"
              onError={handleImageError}
            />
          </div>
          <div className="owner-info">
            <h3 className="owner-name">{displayName}</h3>
            <p className="owner-role">{role}</p>
            <div className="owner-rating">
              <StarRating rating={rating} />
              <span className="rating-text">
                {totalReviews > 0
                  ? ` (${totalReviews} review${totalReviews !== 1 ? 's' : ''})`
                  : ' (No reviews yet)'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="owner-details-section">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            {email !== 'No email provided' ? (
              <a href={`mailto:${email}`} className="detail-value link">
                {email}
              </a>
            ) : (
              <span className="detail-value">{email}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            {phoneNumber !== 'No phone number provided' ? (
              <a href={`tel:${phoneNumber}`} className="detail-value link">
                {phoneNumber}
              </a>
            ) : (
              <span className="detail-value">{phoneNumber}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{address}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Member Since:</span>
            <span className="detail-value">{memberSince}</span>
          </div>
        </div>

        <div className="owner-actions">
          {phoneNumber !== 'No phone number provided' && (
            <a
              href={`tel:${phoneNumber}`}
              className="action-button primary"
            >
              Call Owner
            </a>
          )}
          {email !== 'No email provided' && (
            <a
              href={`mailto:${email}`}
              className="action-button secondary"
            >
              Send Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;