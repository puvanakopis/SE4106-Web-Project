import { FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './TransportCard.css';

const TransportCard = ({ vehicle, saved, onSave, onClick }) => (
  <article className="transport-card" onClick={onClick}>
    
    {/* ------------- Image Section ------------- */}
    <div className="vehicle-image-container">
      <img
        src={vehicle.vehicle_images[0]}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="vehicle-image"
        loading="lazy"
      />
      <span className="vehicle-badge">{vehicle.vehicle_type}</span>

      {/* Save Button */}
      <button
        className={`save-button ${saved ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSave(vehicle.vehicle_id, e);
        }}
        aria-label={saved ? 'Remove from saved' : 'Save this vehicle'}
      >
        {saved ? (
          <FaHeart className="icon-heart-filled" />
        ) : (
          <FaRegHeart className="icon-heart-outline" />
        )}
      </button>
    </div>

    {/* ------------- Content Section ------------- */}
    <div className="vehicle-content">
      {/* Title, Brand, Model */}
      <div className="vehicle-main-info">
        <h2 className="vehicle-title">
          {vehicle.brand} {vehicle.model}
        </h2>
        <div className="vehicle-specs">
        </div>
        <div className="vehicle-location">{vehicle.address}</div>
      </div>

      {/* Rating & Reviews */}
      <div className="vehicle-rating-reviews">
        <StarRating rating={vehicle.averageRating || 3} />
        <span className="reviews">{vehicle.totalReviews} + reviews</span>
      </div>

      {/* Key Features */}
      <div className="vehicle-features">
        <div className="feature-item">
          {vehicle.features.slice(0, 3).map((item, index) => (
          <span key={index}>{item}</span>
        ))}
        </div>
      </div>

      {/* Price & Button */}
      <div className="vehicle-bottom-row">
        <div className="vehicle-price">
          Rs {vehicle.rental_price_per_day.toLocaleString()}{' '}
          <span className="price-period">/ day</span>
  
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

export default TransportCard;