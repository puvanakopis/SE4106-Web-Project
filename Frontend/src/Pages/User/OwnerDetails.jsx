import { assets } from '../../Assets/assets';
import './OwnerDetails.css';
import StarRating from '../../Components/Rating/StarRating'


const OwnerDetails = ({ owner, onClose }) => {
  if (!owner) return null;

  return (
    <div className="owner-modal-overlay">
      <div className="owner-modal">
        <div className="owner-modal-header">
          <h2>Owner Details</h2>
          <button className="close-button" onClick={onClose}>
            <img src={assets.closeIcon} alt="Close" />
          </button>
        </div>

        <div className="owner-profile-section">
          <div className="owner-avatar-container">
            <img 
              src={owner.profile_pic || assets.defaultAvatar} 
              alt={owner.username} 
              className="owner-avatar"
            />
          </div>
          <div className="owner-info">
            <h3 className="owner-name">{owner.DisplayName}</h3>
            <p className="owner-role">{owner.role}</p>
            <div className="owner-rating">
              <StarRating rating={4} />
              <span className="rating-text"> ({owner.totalReviews} + reviews)</span>
            </div>
          </div>
        </div>

        <div className="owner-details-section">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <a href={`mailto:${owner.email}`} className="detail-value link">
              {owner.email}
            </a>
          </div>

          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{owner.PhoneNumber}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{owner.Address}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Member Since:</span>
            <span className="detail-value">{owner.accontCretDate}</span>
          </div>
        </div>


        <div className="owner-actions">
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