import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { assets, vehicleData } from '../Assets/assets';
import './TransportDetails.css';

const RatingDisplay = ({ rating, small = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`custom-rating ${small ? 'small' : ''}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full-star">★</span>
      ))}
      {hasHalfStar && <span className="star half-star">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty-star">★</span>
      ))}
      {!small && <span className="rating-text">{rating.toFixed(1)}</span>}
    </div>
  );
};

const TransportDetails = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const vehicle = vehicleData.find(v => v.vehicle_id === id);

  if (!vehicle) {
    return (
      <div className="not-found">
        <h2>Vehicle not found</h2>
        <p>Please check the ID or go back to the transport list.</p>
      </div>
    );
  }

  const images = vehicle.vehicle_images || [];
  const owner = vehicle.owner || {};
  const ratingDist = vehicle.rating_distribution || {};

  return (
    <div className="vehicle-detail">
      <div className="room-title-section">
        <h3 className="room-main-title">
          {vehicle.model} <span className="room-type-badge">{vehicle.vehicle_type}</span>
        </h3>
      </div>

      <div className="room-rating-section">
        <RatingDisplay rating={vehicle.average_rating} />
        <span className="reviews-count">200+ reviews</span>
      </div>

      <div className="room-location">
        <img src={assets.locationIcon} alt="Location icon" />
        <span>{vehicle.address}</span>
      </div>

      <div className="vehicle-image-gallery">
        <div className="main-image">
          <img src={images[selectedImageIndex]} alt={`${vehicle.brand} ${vehicle.model}`} />
        </div>
        <div className="thumbnail-container">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="vehicle-detail-content">
        <div className="specs-card">
          <h2>Vehicle Specifications</h2>
          <div className="specs-grid">
            <div className="spec-item"><span className="spec-label">Vehicle Type</span><span className="spec-value">{vehicle.vehicle_type}</span></div>
            <div className="spec-item"><span className="spec-label">Brand</span><span className="spec-value">{vehicle.brand}</span></div>
            <div className="spec-item"><span className="spec-label">Model</span><span className="spec-value">{vehicle.model}</span></div>
            <div className="spec-item"><span className="spec-label">Year</span><span className="spec-value">{vehicle.year}</span></div>
            <div className="spec-item"><span className="spec-label">Fuel Type</span><span className="spec-value">{vehicle.fuel_type}</span></div>
            <div className="spec-item"><span className="spec-label">Seating Capacity</span><span className="spec-value">{vehicle.seating_capacity}</span></div>
            <div className="spec-item"><span className="spec-label">Registration Number</span><span className="spec-value">{vehicle.registration_number}</span></div>
          </div>
        </div>

        <div className="vehicle-booking">
          <div className="price-card">
            <div className="price-section">
              <span className="price">Rs {vehicle.rental_price_per_day.toLocaleString()}</span>
              <span className="price-label">per day</span>
            </div>
            <div className="deposit-section">
              <span>Security Deposit: Rs {vehicle.deposit_amount.toLocaleString()}</span>
            </div>
            <div className="availability">
              {vehicle.availability_status ? (
                <span className="available">Available</span>
              ) : (
                <span className="unavailable">Currently Unavailable</span>
              )}
            </div>
            <button className="book-button" disabled={!vehicle.availability_status}>
              {vehicle.availability_status ? 'Book Now' : 'Not Available'}
            </button>
          </div>

          <div className="owner-info">
            <h2>Vehicle Owner</h2>
            <div className="owner-details">
              <img
                src={owner.avatar || owner.profile_pic || "default-avatar.png"}
                alt={owner.username || owner.display_name}
              />
              <div>
                <h4>{owner.username}</h4>
                <div className="owner-rating">
                  <RatingDisplay rating={vehicle.average_rating} small />
                  <span>{vehicle.total_reviews} reviews</span>
                </div>
              </div>
            </div>
            <button className="contact-button">
              Contact Owner
            </button>
          </div>
        </div>
      </div>

      <div className="vehicle-reviews">
        <h2>Reviews</h2>
        <div className="reviews-summary">
          <div className="overall-rating">
            <span className="rating-number">{vehicle.average_rating}</span>
            <RatingDisplay rating={vehicle.average_rating} />
            <span>{vehicle.total_reviews || 200} reviews</span>
          </div>
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="rating-bar">
                <span>{star} star</span>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${(ratingDist[star] || 30) / 100 * 150}px` }}
                  ></div>
                </div>
                <span>{ratingDist[star] || 30}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="review-list">
          {vehicle.reviews?.slice(0, 3).map((review, index) => (
            <div key={index} className="review-card">
              <div className="reviewer-info">
                <img src={review.user.avatar} alt={review.user.name} />
                <div>
                  <h4>{review.user.name}</h4>
                  <RatingDisplay rating={review.rating} small />
                </div>
              </div>
              <p className="review-text">{review.comment}</p>
              <span className="review-date">{review.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportDetails;
