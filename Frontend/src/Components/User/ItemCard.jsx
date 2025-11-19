import { FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../Rating/StarRating';
import './ItemCard.css';

const ItemCard = ({ item, saved, onSave, onClick }) => {

  const mainImage = item.images?.[0];
  const type = item.type
  const name = item.name
  const address = item.address
  const averageRating = item.averageRating
  const totalReviews = item.totalReviews
  const features = item.features
  const price_per_month = item.price_per_month
  const price_per_day = item.rental_price_per_day


  return (
    <div className="card-item" onClick={onClick}>

      {/* ------------- Image Section ------------- */}
      <div className="card-image-container">
        <img
          src={`http://localhost:5000${mainImage}`}
          alt={name}
          className="card-image"
        />

        {/* Accommodation Type Badge */}
        <span className="card-badge">{type}</span>


        {/* Save Button */}
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSave(item.id, e);
          }}
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
          <div className="card-address">{address}</div>
        </div>

        {/* Rating & Reviews */}
        <div className="card-rating-reviews">
          <StarRating rating={averageRating || 0} />
          <span className="reviews">
            {totalReviews} reviews
          </span>
        </div>

        {/* features Preview */}
        {features && features.length > 0 && (
          <div className="card-features-preview">
            {features.slice(0, 3).map((item, index) => (
              <span key={index} className="amenity-tag">{item}</span>
            ))}
            {features.length > 3 && (
              <span className="amenity-tag-more">+{features.length - 3} more</span>
            )}
          </div>
        )}

        {/* Price & Button */}
        <div className="card-bottom-row">
          <div className="card-price-simple">
            {price_per_month ? (
              <>
                Rs {price_per_month}
                <span className="price-period"> / month</span>
              </>
            ) : price_per_day ? (
              <>
                Rs {price_per_day}
                <span className="price-period"> / day</span>
              </>
            ) : (
              "Not Available"
            )}
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
    </div>
  );
};

export default ItemCard;