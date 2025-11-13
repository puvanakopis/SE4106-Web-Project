import { FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './AccommodationCard.css';

const AccommodationCard = ({ accommodation, saved, onSave, onClick }) => (
  <article className="acc-accommodation-card" onClick={onClick}>
    
    
    {/* ------------- Image Section ------------- */}
    <div className="accommodation-image-container">
      <img
        src={accommodation.images[0]}
        alt={`${accommodation.name}`}
        className="accommodation-image"
        loading="lazy"
      />
      <span className="accommodation-badge">{accommodation.accommodationType}</span>

      {/* Save Button */}
      <button
        className={`save-button ${saved ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSave(accommodation._id, e);
        }}
        aria-label={saved ? 'Remove from saved' : 'Save this accommodation'}
      >
        {saved ? (
          <FaHeart className="icon-heart-filled" />
        ) : (
          <FaRegHeart className="icon-heart-outline" />
        )}
      </button>
    </div>

    {/* ------------- Content Section ------------- */}
    <div className="accommodation-simple-content">
      {/* Title, Name, Address */}
      <div className="accommodation-main-info">
        <h2 className="accommodation-title">
          {accommodation.accommodationName}
        </h2>
        <div className="accommodation-hotel-name">{accommodation.location}</div>
      </div>

      {/* Rating & Reviews */}
      <div className="accommodation-rating-reviews">
        <StarRating rating={accommodation.averageRating} />
        <span className="reviews">{accommodation.totalReviews} + reviews</span>
      </div>

      {/* Amenities Preview */}
      <div className="accommodation-amenities-preview">
        {accommodation.amenities.slice(0, 3).map((item, index) => (
          <span key={index} className="amenity-tag">{item}</span>
        ))}
      </div>

      {/* Price & Button */}
      <div className="accommodation-bottom-row">
        <div className="accommodation-price-simple">
          Rs {accommodation.pricePerMonth.toLocaleString()}{' '}
          <span className="price-period">/ month</span>
        </div>
        <button
          className="view-details-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  </article>
);

export default AccommodationCard;