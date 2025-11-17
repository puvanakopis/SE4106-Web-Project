import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './AccommodationCard.css';

const AccommodationCard = ({ accommodation, saved, onSave, onClick }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-accommodation.jpg';

    if (imagePath.startsWith('http')) return imagePath;

    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }

    return imagePath;
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price not available';
    return `Rs ${price.toLocaleString()}`;
  };

  const handleImageError = (e) => {
    e.target.src = '/images/default-accommodation.jpg';
  };

  // Get accommodation display name based on available properties
  const getDisplayName = () => {
    return accommodation.accommodation_name || 
           accommodation.accommodationName || 
           `${accommodation.accommodation_type} Accommodation` ||
           'Unnamed Accommodation';
  };

  // Get accommodation type for badge
  const getAccommodationType = () => {
    return accommodation.accommodation_type || 
           accommodation.accommodationType || 
           '';
  };

  // Get price value
  const getPrice = () => {
    return accommodation.price_per_month || 
           accommodation.pricePerMonth || 
           0;
  };

  // Get rating value
  const getRating = () => {
    return accommodation.averageRating || 0;
  };

  // Get review count
  const getReviewCount = () => {
    return accommodation.totalReviews || 0;
  };

  // Get address
  const getAddress = () => {
    return accommodation.address || 
           'Address not specified';
  };

  // Get amenities
  const getAmenities = () => {
    return accommodation.amenities || [];
  };

  // Get images
  const getImages = () => {
    return accommodation.accommodation_images || 
           accommodation.images || 
           [];
  };

  return (
    <article className="acc-accommodation-card" onClick={onClick}>

      {/* ------------- Image Section ------------- */}
      <div className="accommodation-image-container">
        <img
          src={getImageUrl(getImages()[0])}
          alt={getDisplayName()}
          className="accommodation-image"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Accommodation Type Badge */}
        {getAccommodationType() && (
          <span className="accommodation-badge">{getAccommodationType()}</span>
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
            {getDisplayName()}
          </h2>
          <div className="accommodation-location">
            {getAddress()}
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="accommodation-rating-reviews">
          <StarRating rating={getRating()} />
          <span className="reviews">
            {getReviewCount()} review{getReviewCount() !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Amenities Preview */}
        {getAmenities().length > 0 && (
          <div className="accommodation-amenities-preview">
            {getAmenities().slice(0, 3).map((item, index) => (
              <span key={index} className="amenity-tag">{item}</span>
            ))}
            {getAmenities().length > 3 && (
              <span className="amenity-tag-more">+{getAmenities().length - 3} more</span>
            )}
          </div>
        )}


        {/* Price & Button */}
        <div className="accommodation-bottom-row">
          <div className="accommodation-price-simple">
            {formatPrice(getPrice())}
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