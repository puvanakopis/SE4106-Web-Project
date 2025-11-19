import { FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../../Rating/StarRating';
import './AccommodationCard.css';

const ItemCard= ({ item, saved, onClick }) => {

  const mainImage = item.images?.[0] || item.images?.[0];
  const type = item.type
  const name = item.name
  const address = item.address
  const averageRating = item.averageRating
  const totalReviews = item.totalReviews
  const amenities = item.amenities
  const price_per_month = item.price_per_month


  return (
    <article className="acc-card-card" onClick={onClick}>

      {/* ------------- Image Section ------------- */}
      <div className="card-image-container">
        <img
          src={`http://localhost:5000${mainImage}`}
          alt={name}
          className="card-image"
        />

        {/* Accommodation Type Badge */}
        {type && (
          <span className="card-badge">{type}</span>
        )}

        {/* Save Button */}
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
        >
          {saved ? (
            <FaHeart className="icon-heart-filled" />
          ) : (
            <FaRegHeart className="icon-heart-outline" />
          )}
        </button>
      </div>

      {/* ------------- Content Section ------------- */}
      <div className="card-simple-content">
        {/* Title, Name, Address */}
        <div className="card-main-info">
          <h2 className="card-title">{name}</h2>
          <div className="card-location">{address}</div>
        </div>

        {/* Rating & Reviews */}
        <div className="card-rating-reviews">
          <StarRating rating={averageRating || 0} />
          <span className="reviews">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Amenities Preview */}
        {amenities && amenities.length > 0 && (
          <div className="card-amenities-preview">
            {amenities.slice(0, 3).map((item, index) => (
              <span key={index} className="amenity-tag">{item}</span>
            ))}
            {amenities.length > 3 && (
              <span className="amenity-tag-more">+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        {/* Price & Button */}
        <div className="card-bottom-row">
          <div className="card-price-simple">
            Rs {price_per_month}
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

export default ItemCard;