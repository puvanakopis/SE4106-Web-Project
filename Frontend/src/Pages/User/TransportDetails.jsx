import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { assets } from '../../Assets/assets';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import StarRating from '../../Components/Rating/StarRating';
import GoogleMapEmbed from '../../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from '../OwnerDetails';
import './TransportDetails.css';

const TransportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { isLoggedIn, user, token } = useContext(AuthContext);

  const [transport, setTransport] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  const fetchTransportData = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log(id)
      const response = await fetch(`${API_BASE_URL}/transports/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transport: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setTransport(result.transport);
        if (result.transport.vehicle_images && result.transport.vehicle_images.length > 0) {
          setMainImage(`${API_BASE_URL}${result.transport.vehicle_images[0]}`);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch transport details');
      }
    } catch (error) {
      console.error('Error fetching transport data:', error);
      setError(error.message || 'Failed to load transport details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportData();
  }, [id]);

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
    if (transport) {
      const cost = diffDays * transport.rental_price_per_day;
      setTotalCost(cost);
    }
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
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

  const handlePaymentSuccess = async () => {
    try {
      // const bookingData = {
      //   transport_id: transport._id,
      //   owner_id: transport.owner_id._id,
      //   start_date: startDate.toISOString().split('T')[0],
      //   end_date: endDate.toISOString().split('T')[0],
      //   total_amount: totalCost,
      //   deposit_amount: transport.deposit_amount,
      //   payment_method: paymentMethod,
      //   status: 'confirmed'
      // };

      // Example API call - implement based on your booking endpoint
      /*
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      */

      // For now, using context to store booking locally
      const newBooking = {
        id: `t-${Date.now()}`,
        type: 'transport',
        item: transport,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        status: 'confirmed',
        totalPrice: totalCost,
        bookingDate: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod,
        userId: user.id
      };

      addBooking(newBooking);

      // Reset form
      setStartDate(null);
      setEndDate(null);
      setTotalDays(0);
      setTotalCost(0);
      setPaymentMethod('credit_card');
      setShowPaymentPopup(false);

    } catch (error) {
      console.error('Booking error:', error);
      setBookingError('Failed to complete booking. Please try again.');
    }
  };

  // Handle contact owner button click
  const handleContactOwner = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/transport/${id}` } });
      return;
    }

    if (!transport?.owner_id) {
      console.warn('No owner data available for this transport');
      alert('Owner information is not currently available. Please try again later.');
      return;
    }

    setShowOwnerDetails(true);
  };

  // Prepare booking details for payment popup
  const getBookingDetails = () => {
    if (!transport) return null;

    return {
      type: 'transport',
      itemName: `${transport.brand} ${transport.model}`,
      duration: `${totalDays} day${totalDays !== 1 ? 's' : ''}`,
      totalAmount: totalDays > 0 ? totalCost + transport.deposit_amount : 0,
      bookingId: `T-${Date.now()}`
    };
  };

  // Format image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return assets.defaultTransportImage;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="transport-loading">
        <div className="loading-spinner"></div>
        <p>Loading transport details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transport-error">
        <h2 className="transport-error__title">Error Loading Transport</h2>
        <p className="transport-error__message">{error}</p>
        <button
          className="back-button"
          onClick={() => navigate('/transport')}
        >
          Browse Available Vehicles
        </button>
      </div>
    );
  }

  // Transport not found state
  if (!transport) {
    return (
      <div className="transport-not-found">
        <h2 className="transport-not-found__title">Transport not found</h2>
        <p className="transport-not-found__message">
          The transport you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="back-button"
          onClick={() => navigate('/transport')}
        >
          Browse Available Vehicles
        </button>
      </div>
    );
  }

  const images = transport.vehicle_images?.map(getImageUrl) || [];
  const owner = transport.owner_id;

  return (
    <main className="transport-details">
      {/* Owner Details Modal */}
      {showOwnerDetails && (
        <OwnerDetails
          owner={owner}
          onClose={() => setShowOwnerDetails(false)}
        />
      )}

      {/* Payment Popup Modal */}
      {showPaymentPopup && (
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          bookingDetails={getBookingDetails()}
          onPaymentSuccess={handlePaymentSuccess}
          paymentMethod={paymentMethod}
        />
      )}

      {/* Vehicle Header Section */}
      <header className="transport-header">
        <h1 className="transport-title">
          <div className='transport-name'>{transport.brand} {transport.model}</div>
          <div className="transport-type">{transport.vehicle_type}</div>
        </h1>

        <div className="transport-meta">
          <StarRating rating={transport.averageRating} />
          <span className="transport-review-count">
            {transport.totalReviews || 0} review{transport.totalReviews !== 1 ? 's' : ''}
          </span>
          {!transport.isAvailable && (
            <span className="transport-status-badge">Not Available</span>
          )}
          {transport.status !== 'Active' && (
            <span className="transport-status-badge">{transport.status}</span>
          )}
        </div>

        <div className="transport-location">
          <img src={assets.locationIcon} alt="Location icon" className="transport-location__icon" />
          <span className="transport-location__text">{transport.address}</span>
        </div>
      </header>

      {/* Vehicle Gallery Section */}
      <section className="transport-gallery">
        <div className="transport-gallery__main">
          <img
            src={mainImage || assets.defaultTransportImage}
            alt={`${transport.brand} ${transport.model}`}
            className="transport-gallery__main-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = assets.defaultTransportImage;
            }}
          />
        </div>
        {images.length > 0 && (
          <div className="transport-gallery__thumbnails">
            {images.slice(0, 4).map((img, index) => (
              <button
                key={index}
                className={`transport-gallery__thumbnail ${mainImage === img ? 'transport-gallery__thumbnail--active' : ''}`}
                onClick={() => setMainImage(img)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="transport-gallery__thumbnail-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = assets.defaultTransportImage;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <div className="transport-content">
        <section className="transport-specs">
          {/* Vehicle Specifications */}
          <div className="transport-Content">
            <h2 className="transport-section-title">Vehicle Specifications</h2>
            <div className="specs-grid">
              <div className="specs-item">
                <span className="specs-title">Vehicle Type</span>
                <span className="specs-value">{transport.vehicle_type}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Brand</span>
                <span className="specs-value">{transport.brand}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Model</span>
                <span className="specs-value">{transport.model}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Year</span>
                <span className="specs-value">{transport.year}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Fuel Type</span>
                <span className="specs-value">{transport.fuel_type}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Seating Capacity</span>
                <span className="specs-value">{transport.seating_capacity}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Registration Number</span>
                <span className="specs-value">{transport.registration_number}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Daily Rate</span>
                <span className="specs-value">Rs {transport.rental_price_per_day?.toLocaleString()}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Security Deposit</span>
                <span className="specs-value">Rs {transport.deposit_amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Features Section */}
            {transport.features && transport.features.length > 0 && (
              <div className="specs-item">
                <h3 className="specs-title">Features</h3>
                <div className="features-list">
                  {transport.features.map((item, index) => (
                    <div key={index} className="feature-item">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            <div className="address-section">
              <h3 className="specs-title">Address</h3>
              <p className="specs-text">{transport.address}</p>
            </div>

            {/* Description Section */}
            <div className="description-section">
              <h3 className="specs-title">Description</h3>
              <p className="specs-text">
                {transport.description || 'No description provided yet. Please check back later for more information.'}
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="transport-Content map">
            <h3 className="transport-section-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={transport.address}
                latitude={transport.location?.latitude}
                longitude={transport.location?.longitude}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <section className="transport-Content transport-reviews">
            <h2 className="transport-section-title">Reviews</h2>

            <div className="reviews-summary">
              <div className="reviews-overview">
                <span className="reviews-average">{transport.averageRating?.toFixed(1) || '0.0'}</span>
                <StarRating rating={transport.averageRating} />
                <span>{transport.totalReviews || 0} review{transport.totalReviews !== 1 ? 's' : ''}</span>
              </div>

              {/* Rating Distribution */}
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = transport.ratingCount?.[star] || 0;
                  const percentage = transport.totalReviews
                    ? (count / transport.totalReviews) * 100
                    : 0;

                  return (
                    <div className="rating-row" key={star}>
                      <span className="star-label">{star} star{star !== 1 ? 's' : ''}</span>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-count">({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Owner Section */}
          <section className="transport-Content transport-host">
            <h2 className="transport-section-title">Vehicle Owner</h2>
            <div className="host-profile">
              <img
                src={owner?.profile_pic || assets.defaultAvatar}
                alt={`${owner?.displayName || owner?.fullName}'s profile`}
                className="host-avatar"
                onError={(e) => {
                  e.target.src = assets.defaultAvatar;
                }}
              />
              <div className="host-info">
                <h4 className="host-name">
                  Owned by {owner?.displayName || owner?.fullName || 'Vehicle Owner'}
                </h4>
                {owner?.averageRating && (
                  <div className="host-rating">
                    <StarRating rating={owner.averageRating} size="small" />
                    <span>{owner.totalReviews || 0} review{owner.totalReviews !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {owner?.phoneNumber && (
                  <div className="host-phone">
                    <img src={assets.phoneIcon} alt="Phone" className="host-phone-icon" />
                    <span>{owner.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              className="host-contact-button"
              onClick={handleContactOwner}
              aria-label="Contact vehicle owner"
            >
              Contact Owner
            </button>
          </section>
        </section>

        {/* Right Column - Booking Card */}
        <aside className="transport-booking">
          <div className="booking-card">
            <div className="booking-card-header">
              <h3 className="transport-section-title">Booking</h3>
              <div className="booking-price">
                Rs {transport.rental_price_per_day?.toLocaleString()}
                <span className="price-period"> / day</span>
              </div>
            </div>

            <div className="booking-dates">
              <div className="booking-date-group">
                <label className="booking-label">Start Date</label>
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
                <label className="booking-label">End Date</label>
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

            <div className="payment-method-section">
              <label className="booking-label">Payment Method</label>
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

            <div className="booking-summary">
              <div className="booking-summary__item">
                <span>Rental Days:</span>
                <span>{totalDays || 0} day{totalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="booking-summary__item">
                <span>Daily Rate:</span>
                <span>Rs {transport.rental_price_per_day?.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--subtotal">
                <span>Subtotal:</span>
                <span>Rs {(totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item">
                <span>Security Deposit:</span>
                <span>Rs {transport.deposit_amount?.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--total">
                <span>Total Amount:</span>
                <span>Rs {totalDays > 0
                  ? (totalCost + transport.deposit_amount).toLocaleString()
                  : 0}</span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>Security Deposit: Rs {transport.deposit_amount?.toLocaleString()} (refundable when vehicle is returned)</span>
            </div>

            <button
              className={`booking-button ${!transport.isAvailable ? 'booking-button--disabled' : ''}`}
              onClick={handleBookNow}
              disabled={!transport.isAvailable || totalDays === 0 || transport.status !== 'Active'}
            >
              {!transport.isAvailable ? 'Not Available' :
                transport.status !== 'Active' ? transport.status :
                  'Book Now'}
            </button>

            {transport.status !== 'Active' && (
              <div className="booking-notice">
                This vehicle is currently {transport.status.toLowerCase()}.
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default TransportDetails;