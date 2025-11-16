import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './AccommodationCard.css';

const AccommodationCard = ({ accommodation, saved, onSave, onClick }) => {
  // Handle missing images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-accommodation.jpg';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;

    // If it's a relative path, make sure it points to the correct backend URL
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }

    return imagePath;
  };

  // Format price with safety check
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price not available';
    return `Rs ${price.toLocaleString()}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = '/images/default-accommodation.jpg';
  };

  return (
    <article className="acc-accommodation-card" onClick={onClick}>

      {/* ------------- Image Section ------------- */}
      <div className="accommodation-image-container">
        <img
          src={getImageUrl(accommodation.images?.[0])}
          alt={accommodation.accommodationName || 'Accommodation'}
          className="accommodation-image"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Accommodation Type Badge */}
        {accommodation.accommodationType && (
          <span className="accommodation-badge">{accommodation.accommodationType}</span>
        )}

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
            {accommodation.accommodationName || 'Unnamed Accommodation'}
          </h2>
          <div className="accommodation-location">{accommodation.address} cekjn</div>
        </div>

        {/* Rating & Reviews */}
        <div className="accommodation-rating-reviews">
          <StarRating rating={accommodation.averageRating || 0} />
          <span className="reviews">
            {accommodation.totalReviews || 0} review{accommodation.totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Amenities Preview */}
        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="accommodation-amenities-preview">
            {accommodation.amenities.slice(0, 3).map((item, index) => (
              <span key={index} className="amenity-tag">{item}</span>
            ))}
            {accommodation.amenities.length > 3 && (
              <span className="amenity-tag-more">+{accommodation.amenities.length - 3} more</span>
            )}
          </div>
        )}

        {/* Price & Button */}
        <div className="accommodation-bottom-row">
          <div className="accommodation-price-simple">
            {formatPrice(accommodation.pricePerMonth)}
            <span className="price-period"> / month</span>
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
};

export default AccommodationCard;