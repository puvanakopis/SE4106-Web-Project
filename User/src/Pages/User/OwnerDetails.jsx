import { assets } from '../../Assets/assets';
import './OwnerDetails.css';
import '../Animation/animations.css';
import { useInView } from 'react-intersection-observer';

const StarRating = ({ rating, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`star-rating star-rating--${size}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star-rating_star star-rating_star--full">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="star-rating_star star-rating_star--half">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star-rating_star star-rating_star--empty">
          ★
        </span>
      ))}
    </div>
  );
};

const OwnerDetails = ({ owner, onClose }) => {
  // ------------------ Animation Hooks ------------------
  const [modalRef, modalInView] = useInView({ threshold: 0.1 });
  const [profileRef, profileInView] = useInView({ threshold: 0.1 });
  const [detailsRef, detailsInView] = useInView({ threshold: 0.1 });
  const [searchesRef, searchesInView] = useInView({ threshold: 0.1 });
  const [actionsRef, actionsInView] = useInView({ threshold: 0.1 });

  if (!owner) return null;

  return (
    <div className="owner-details">
      {/* --------------------------- Modal Container --------------------------- */}
      <div
        ref={modalRef}
        className={`owner-modal ${modalInView ? 'fade-in' : ''}`}
      >
        {/* --------------------------- Modal Header --------------------------- */}
        <div className={`owner-modal-header ${modalInView ? 'slide-in-down' : ''}`}>
          <h2>Owner Details</h2>
          <button className="close-button" onClick={onClose}>
            <img src={assets.closeIcon} alt="Close" />
          </button>
        </div>

        {/* --------------------------- Profile Section --------------------------- */}
        <div
          ref={profileRef}
          className={`owner-profile-section ${profileInView ? 'slide-in-left' : ''}`}
        >
          <div className="owner-avatar-container">
            <img
              src={owner.profile_pic || assets.defaultAvatar}
              alt={owner.username}
              className="owner-avatar"
            />
          </div>
          <div className="owner-info">
            <h3 className="owner-name">{owner.username}</h3>
            <p className="owner-role">{owner.role}</p>
            <div className="owner-rating">
              <StarRating rating={4.5} size="small" />
              <span className="rating-text">4.5 (50+ reviews)</span>
            </div>
          </div>
        </div>

        {/* --------------------------- Details Section --------------------------- */}
        <div
          ref={detailsRef}
          className={`owner-details-section ${detailsInView ? 'slide-in-right' : ''}`}
        >
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <a href={`mailto:${owner.email}`} className="detail-value link">
              {owner.email}
            </a>
          </div>

          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">+94 76 123 4567</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">Colombo, Sri Lanka</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Member Since:</span>
            <span className="detail-value">January 2022</span>
          </div>
        </div>

        {/* --------------------------- Recent Searches Section --------------------------- */}
        <div
          ref={searchesRef}
          className={`recent-searches-section ${searchesInView ? 'slide-in-left' : ''}`}
        >
          <h4>Recently Searched Cities</h4>
          <div className="city-tags">
            {owner.recentSearchedCities?.map((city, index) => (
              <span key={index} className="city-tag">{city}</span>
            ))}
          </div>
        </div>

        {/* --------------------------- Action Buttons --------------------------- */}
        <div
          ref={actionsRef}
          className={`owner-actions ${actionsInView ? 'slide-in-up' : ''}`}
        >
          <button className="action-button primary">
            Send Message
          </button>
          <button className="action-button secondary">
            Call Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;