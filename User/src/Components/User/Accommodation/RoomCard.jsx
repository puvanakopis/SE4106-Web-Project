import { FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './RoomCard.css';

const RoomCard = ({ room, saved, onSave, onClick }) => (
  <article className="acc-room-card" onClick={onClick}>
    
    
    {/* ------------- Image Section ------------- */}
    <div className="room-image-container">
      <img
        src={room.images[0]}
        alt={`${room.name}`}
        className="room-image"
        loading="lazy"
      />
      <span className="room-badge">{room.roomType}</span>

      {/* Save Button */}
      <button
        className={`save-button ${saved ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSave(room._id, e);
        }}
        aria-label={saved ? 'Remove from saved' : 'Save this room'}
      >
        {saved ? (
          <FaHeart className="icon-heart-filled" />
        ) : (
          <FaRegHeart className="icon-heart-outline" />
        )}
      </button>
    </div>

    {/* ------------- Content Section ------------- */}
    <div className="room-simple-content">
      {/* Title, Name, Address */}
      <div className="room-main-info">
        <h2 className="room-title">
          {room.roomName}
        </h2>
        <div className="room-hotel-name">{room.location}</div>
      </div>

      {/* Rating & Reviews */}
      <div className="room-rating-reviews">
        <StarRating rating={room.averageRating} />
        <span className="reviews">{room.totalReviews} + reviews</span>
      </div>

      {/* Amenities Preview */}
      <div className="room-amenities-preview">
        {room.amenities.slice(0, 3).map((item, index) => (
          <span key={index} className="amenity-tag">{item}</span>
        ))}
      </div>

      {/* Price & Button */}
      <div className="room-bottom-row">
        <div className="room-price-simple">
          Rs {room.pricePerMonth.toLocaleString()}{' '}
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

export default RoomCard;