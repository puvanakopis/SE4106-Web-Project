import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { assets, vehicleData } from '../../Assets/assets';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import StarRating from '../../Components/Rating/StarRating';
import GoogleMapEmbed from '../../Components/User/GoogleMap';
import PaymentPopup from '../../Components/User/PaymentPopup';
import OwnerDetails from './OwnerDetails';
import { scrollToTop } from '../scrollToTop';
import { useInView } from 'react-intersection-observer';
import './TransportDetails.css';
import '../Animation/animations.css';

const TransportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { isLoggedIn, user } = useContext(AuthContext);

  /* ------------- State Declarations ------------- */
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);

  /* ------------- Animation Refs ------------- */
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [galleryRef, galleryInView] = useInView({ threshold: 0.1 });
  const [specsRef, specsInView] = useInView({ threshold: 0.1 });
  const [bookingRef, bookingInView] = useInView({ threshold: 0.1 });
  const [reviewsRef, reviewsInView] = useInView({ threshold: 0.1 });
  const [ownerRef, ownerInView] = useInView({ threshold: 0.1 });

  const vehicle = vehicleData.find((v) => v.vehicle_id === id);

  /* ------------- Date Handling Functions ------------- */
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

  /* ------------- Calculation Functions ------------- */
  const calculateTotal = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalDays(diffDays);
    if (vehicle) {
      const cost = diffDays * vehicle.rental_price_per_day;
      setTotalCost(cost);
    }
  };

  /* ------------- Owner Contact Functions ------------- */
  const handleContactOwner = () => {
    if (!isLoggedIn) {
      scrollToTop();
      navigate('/login', { state: { from: `/transport/${id}` } });
      return;
    }

    if (!vehicle?.owner) {
      console.warn('No owner data available for this vehicle');
      alert('Owner information is not currently available. Please try again later.');
      return;
    }

    setShowOwnerDetails(true);
  };

  /* ------------- Booking Functions ------------- */
  const handleBookNow = () => {
    if (!isLoggedIn) {
      scrollToTop();
      navigate('/login', { state: { from: `/transport/${id}` } });
      return;
    }

    if (!startDate || !endDate) {
      setBookingError('Please select both start and end dates');
      return;
    }
    if (startDate > endDate) {
      setBookingError('End date must be after start date');
      return;
    }

    setShowPaymentPopup(true);
  };

  const handlePaymentSuccess = () => {
    const newBooking = {
      id: `t-${Date.now()}`,
      type: 'transport',
      item: vehicle,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'confirmed',
      totalPrice: totalCost,
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod,
      userId: user.id
    };

    addBooking(newBooking);

    // Show success animation
    const bookingButton = document.querySelector('.booking-button');
    if (bookingButton) {
      bookingButton.classList.add('bounce');
      setTimeout(() => {
        bookingButton.classList.remove('bounce');
      }, 1000);
    }

    setStartDate(null);
    setEndDate(null);
    setTotalDays(0);
    setTotalCost(0);
    setPaymentMethod('credit_card');
    setShowPaymentPopup(false);
  };

  const getBookingDetails = () => {
    if (!vehicle) return null;

    return {
      type: 'transport',
      itemName: `${vehicle.brand} ${vehicle.model}`,
      duration: `${totalDays} day${totalDays !== 1 ? 's' : ''}`,
      totalAmount: totalDays > 0 ? totalCost + vehicle.deposit_amount : 0,
      bookingId: `T-${Date.now()}`
    };
  };

  /* ------------- Vehicle Not Found Section ------------- */
  if (!vehicle) {
    return (
      <div className={`transport-not-found fade-in`}>
        <h2 className="transport-not-found__title">Vehicle not found</h2>
        <p className="transport-not-found__message">
          Please check the ID or go back to the transport list.
        </p>
        <button
          className="back-button pulse"
          onClick={() => navigate('/transport')}
        >
          Browse Available Vehicles
        </button>
      </div>
    );
  }

  const images = vehicle.vehicle_images || [];
  const owner = vehicle.owner || {};
  const ratingDist = vehicle.rating_distribution || {};

  return (
    <main className="transport-details">
      {/* ------------- Popup Modals Section ------------- */}
      {showOwnerDetails && (
        <OwnerDetails
          owner={owner}
          onClose={() => setShowOwnerDetails(false)}
          className={`${ownerInView ? 'scale-up' : ''}`}
        />
      )}

      {showPaymentPopup && (
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          bookingDetails={getBookingDetails()}
          onPaymentSuccess={handlePaymentSuccess}
          paymentMethod={paymentMethod}
          className={`${bookingInView ? 'fade-in-up' : ''}`}
        />
      )}

      {/* ------------- Header Section ------------- */}
      <header
        ref={headerRef}
        className={`transport-header ${headerInView ? 'slide-in-left' : ''}`}
      >
        <h1 className="transport-title">
          <div className='transport-name'>{vehicle.brand} {vehicle.model}</div>
          <div className="transport-type">{vehicle.vehicle_type}</div>
        </h1>

        <div className="transport-meta">
          <StarRating rating={vehicle.average_rating} />
          <span className="transport-review-count">{vehicle.total_reviews || 200}+ reviews</span>
        </div>

        <div className="transport-location">
          <img src={assets.locationIcon} alt="Location icon" className="transport-location__icon" />
          <span className="transport-location__text">{vehicle.address}</span>
        </div>
      </header>

      {/* ------------- Gallery Section ------------- */}
      <section
        ref={galleryRef}
        className={`transport-gallery ${galleryInView ? 'scale-up delay-100' : ''}`}
      >
        <div className="transport-gallery__main">
          <img
            src={images[selectedImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="transport-gallery__main-image"
            loading="lazy"
          />
        </div>
        <div className="transport-gallery__thumbnails">
          {images.slice(0, 4).map((img, index) => (
            <button
              key={index}
              className={`transport-gallery__thumbnail ${index === selectedImageIndex ? 'transport-gallery__thumbnail--active' : ''}`}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="transport-gallery__thumbnail-image"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {/* ------------- Main Content Section ------------- */}
      <div className="transport-content">
        {/* ------------- Specifications Section ------------- */}
        <section
          ref={specsRef}
          className={`transport-specs ${specsInView ? 'slide-in-left delay-200' : ''}`}
        >
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
            <div className="specs-item">
              <span className="specs-label">Daily Rate</span>
              <span className="specs-value">Rs {vehicle.rental_price_per_day.toLocaleString()}</span>
            </div>
          </div>

          {/* Description Subsection */}
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">
              {vehicle.description || 'No description provided yet. Please check back later for more information.'}
            </p>
          </div>

          {/* Map Subsection */}
          <div className="map-section">
            <h3 className="map-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={vehicle.address}
                city={vehicle.location || 'Colombo'}
              />
            </div>
          </div>
        </section>

        {/* ------------- Booking Section ------------- */}
        <aside
          ref={bookingRef}
          className={`transport-booking ${bookingInView ? 'slide-in-right delay-200' : ''}`}
        >
          <div className="booking-card">
            <div className="booking-price">
              <span className="booking-price__amount">
                Rs {vehicle.rental_price_per_day.toLocaleString()}
              </span>
              <span className="booking-price__label">per day</span>
            </div>

            {/* Date Selection Subsection */}
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
              {bookingError && <div className="booking-error fade-in">{bookingError}</div>}
            </div>

            {/* Payment Method Subsection */}
            <div className="payment-method-section">
              <label className="payment-method__label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-method__select"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="net_banking">Net Banking</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            {/* Booking Summary Subsection */}
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
                <span>Rs {totalDays > 0
                  ? (totalCost + vehicle.deposit_amount).toLocaleString()
                  : 0}</span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>Security Deposit: Rs {vehicle.deposit_amount.toLocaleString()} (refundable when vehicle is returned)</span>
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

      {/* ------------- Secondary Sections ------------- */}
      <div className="transport-secondary">
        {/* ------------- Reviews Section ------------- */}
        <section
          ref={reviewsRef}
          className={`transport-reviews ${reviewsInView ? 'slide-in-left delay-300' : ''}`}
        >
          <h2 className="transport-section-title">Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-overview">
              <span className="reviews-average">{vehicle.average_rating}</span>
              <StarRating rating={vehicle.average_rating} />
              <span>{vehicle.total_reviews || 200}+ reviews</span>
            </div>
            <div className="reviews-distribution">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="reviews-distribution__item fade-in-up" style={{ animationDelay: `${star * 100}ms` }}>
                  <span>{star} star</span>
                  <div className="reviews-distribution__bar-container">
                    <div
                      className="reviews-distribution__bar"
                      style={{ width: `${((ratingDist[star] || 30) / 100) * 150}px` }}
                    ></div>
                  </div>
                  <span>{ratingDist[star] || 30}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------- Owner Section ------------- */}
        <section
          ref={ownerRef}
          className={`transport-owner ${ownerInView ? 'slide-in-right delay-300' : ''}`}
        >
          <h2 className="transport-section-title">Vehicle Owner</h2>
          <div className="owner-profile">
            <img
              src={owner.profile_pic || assets.defaultAvatar}
              alt={owner.username || 'Vehicle owner'}
              className="owner-avatar"
            />
            <div className="owner-info">
              <h4 className="owner-name">Owned by {owner.username || 'Private Owner'}</h4>
              <div className="owner-rating">
                <StarRating rating={vehicle.average_rating} size="small" />
                <span>{vehicle.total_reviews} reviews</span>
              </div>
              <div className="owner-response-info">
                <span>Response rate: 98%</span>
                <span>Response time: within an hour</span>
              </div>
            </div>
          </div>
          <button
            className="owner-contact-button"
            onClick={handleContactOwner}
            aria-label="Contact vehicle owner"
          >
            Contact Owner
          </button>
        </section>
      </div>
    </main>
  );
};


export default TransportDetails;