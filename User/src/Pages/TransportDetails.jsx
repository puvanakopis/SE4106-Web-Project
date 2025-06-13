import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { assets, vehicleData } from '../Assets/assets';
import './TransportDetails.css';

const StarRating = ({ rating, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`star-rating star-rating--${size}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star-rating__star star-rating__star--full">
          ★
        </span>
      ))}
      {hasHalfStar && (
        <span className="star-rating__star star-rating__star--half">★</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star-rating__star star-rating__star--empty">
          ★
        </span>
      ))}
      {size === 'medium' && (
        <span className="star-rating__value">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

const TransportDetails = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingError, setBookingError] = useState('');

  const vehicle = vehicleData.find((v) => v.vehicle_id === id);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setBookingError('');
    if (date && endDate && date > endDate) {
      setEndDate(null);
      setTotalDays(0);
      setTotalCost(0);
    } else if (date && endDate) {
      calculateTotal(date, endDate);
    } else {
      setTotalDays(0);
      setTotalCost(0);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setBookingError('');
    if (date && startDate) {
      calculateTotal(startDate, date);
    } else {
      setTotalDays(0);
      setTotalCost(0);
    }
  };

  const calculateTotal = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalDays(diffDays);
    if (vehicle) {
      const cost = diffDays * vehicle.rental_price_per_day;
      setTotalCost(cost);
    }
  };

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      setBookingError('Please select both start and end dates');
      return;
    }
    if (startDate > endDate) {
      setBookingError('End date must be after start date');
      return;
    }
    
    console.log('Booking details:', {
      vehicleId: vehicle.vehicle_id,
      startDate,
      endDate,
      totalDays,
      totalCost,
      deposit: vehicle.deposit_amount,
      totalWithDeposit: totalCost + vehicle.deposit_amount,
    });

    alert(
      `Booking confirmed for ${vehicle.model} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. Total cost: Rs ${totalCost.toLocaleString()}`
    );
  };

  if (!vehicle) {
    return (
      <div className="transport-not-found">
        <h2 className="transport-not-found__title">Vehicle not found</h2>
        <p className="transport-not-found__message">
          Please check the ID or go back to the transport list.
        </p>
      </div>
    );
  }

  const images = vehicle.vehicle_images || [];
  const owner = vehicle.owner || {};
  const ratingDist = vehicle.rating_distribution || {};

  return (
    <div className="transport-details">
      <header className="transport-header">
        <h1 className="transport-title">
          {vehicle.model} <span className="transport-badge">{vehicle.vehicle_type}</span>
        </h1>

        <div className="transport-meta">
          <StarRating rating={vehicle.average_rating} />
          <span className="transport-review-count">200+ reviews</span>
        </div>

        <div className="transport-location">
          <img 
            src={assets.locationIcon} 
            alt="Location" 
            className="transport-location__icon" 
          />
          <span>{vehicle.address}</span>
        </div>
      </header>

      <section className="transport-gallery">
        <div className="transport-gallery__main">
          <img 
            src={images[selectedImageIndex]} 
            alt={`${vehicle.brand} ${vehicle.model}`} 
            className="transport-gallery__main-image" 
          />
        </div>
        <div className="transport-gallery__thumbnails">
          {images.slice(0, 4).map((img, index) => (
            <button
              key={index}
              className={`transport-gallery__thumbnail ${
                index === selectedImageIndex ? 'transport-gallery__thumbnail--active' : ''
              }`}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className="transport-gallery__thumbnail-image" 
              />
            </button>
          ))}
        </div>
      </section>

      <div className="transport-content">
        <div className="transport-card">
          <section className="transport-specs">
            <h2 className="transport-section-title">Vehicle Specifications</h2>
            <div className="specs-grid">
              <div className="specs-item">
                <span className="specs-label">Vehicle Type</span>
                <span className="specs-value">{vehicle.vehicle_type}</span>
              </div>
              <div className="specs-item">
                <span className="specs-label">Brand</span>
                <span className="specs-value">{vehicle.brand}</span>
              </div>
              <div className="specs-item">
                <span className="specs-label">Model</span>
                <span className="specs-value">{vehicle.model}</span>
              </div>
              <div className="specs-item">
                <span className="specs-label">Year</span>
                <span className="specs-value">{vehicle.year}</span>
              </div>
              <div className="specs-item">
                <span className="specs-label">Fuel Type</span>
                <span className="specs-value">{vehicle.fuel_type}</span>
              </div>
              <div className="specs-item">
                <span className="specs-label">Seating Capacity</span>
                <span className="specs-value">{vehicle.seating_capacity}</span>
              </div>
              <div className="specs-item">
                <span className="specs-label">Registration Number</span>
                <span className="specs-value">{vehicle.registration_number}</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="transport-booking">
          <div className="booking-card">
            <div className="booking-price">
              <span className="booking-price__amount">
                Rs {vehicle.rental_price_per_day.toLocaleString()}
              </span>
              <span className="booking-price__label">per day</span>
            </div>

            <div className="booking-dates">
              <div className="booking-date-group">
                <label className="booking-dates__label">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  placeholderText="Select start date"
                  className="booking-dates__input"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
              <div className="booking-date-group">
                <label className="booking-dates__label">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  minDate={startDate || new Date()}
                  placeholderText="Select end date"
                  className="booking-dates__input"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  disabled={!startDate}
                />
              </div>
              {bookingError && <div className="booking-error">{bookingError}</div>}
            </div>

            <div className="booking-summary">
              <div className="booking-summary__item">
                <span>Rental Days:</span>
                <span>{totalDays || 0} day{totalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="booking-summary__item">
                <span>Daily Rate:</span>
                <span>Rs {vehicle.rental_price_per_day.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--subtotal">
                <span>Subtotal:</span>
                <span>Rs {(totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item">
                <span>Security Deposit:</span>
                <span>Rs {vehicle.deposit_amount.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--total">
                <span>Total Amount:</span>
                <span>
                  Rs {totalDays > 0
                    ? (totalCost + vehicle.deposit_amount).toLocaleString()
                    : 0}
                </span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>
                Security Deposit: Rs {vehicle.deposit_amount.toLocaleString()} 
                (refundable when vehicle is returned)
              </span>
            </div>
            <div className="booking-availability">
              {vehicle.availability_status ? (
                <span className="booking-availability__available">Available</span>
              ) : (
                <span className="booking-availability__unavailable">
                  Currently Unavailable
                </span>
              )}
            </div>
            <button
              className="booking-button"
              onClick={handleBookNow}
              disabled={!vehicle.availability_status || totalDays === 0}
            >
              {vehicle.availability_status ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </aside>
      </div>

      <div className="transport-secondary">
        <section className="transport-reviews">
          <h2 className="transport-section-title">Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-overview">
              <span className="reviews-average">{vehicle.average_rating}</span>
              <StarRating rating={vehicle.average_rating} />
              <span>{vehicle.total_reviews || 200} reviews</span>
            </div>
            <div className="reviews-distribution">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="reviews-distribution__item">
                  <span>{star} star</span>
                  <div className="reviews-distribution__bar-container">
                    <div
                      className="reviews-distribution__bar"
                      style={{ 
                        width: `${((ratingDist[star] || 30) / 100) * 150}px` 
                      }}
                    />
                  </div>
                  <span>{ratingDist[star] || 30}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="transport-owner">
          <h2 className="transport-section-title">Vehicle Owner</h2>
          <div className="owner-profile">
            <img
              src={owner.avatar || owner.profile_pic || "default-avatar.png"}
              alt={owner.username || owner.display_name}
              className="owner-avatar"
            />
            <div className="owner-info">
              <h4 className="owner-name">{owner.username}</h4>
              <div className="owner-rating">
                <StarRating rating={vehicle.average_rating} size="small" />
                <span>{vehicle.total_reviews} reviews</span>
              </div>
            </div>
          </div>
          <button className="owner-contact-button">
            Contact Owner
          </button>
        </section>
      </div>
    </div>
  );
};

export default TransportDetails;