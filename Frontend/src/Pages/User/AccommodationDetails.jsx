import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { assets } from '../../Assets/assets';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import StarRating from '../../Components/Rating/StarRating';
import GoogleMapEmbed from '../../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from './OwnerDetails';
import './AccommodationDetails.css';

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { isLoggedIn, user, token } = useContext(AuthContext);

  // State management
  const [accommodation, setAccommodation] = useState(null);
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
  const [isBooking, setIsBooking] = useState(false);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Process accommodation images
  const processAccommodationImages = (images) => {
    if (!images || !Array.isArray(images)) {
      return [assets.defaultAccommodation];
    }
    
    return images.map(image => {
      if (!image) return assets.defaultAccommodation;
      
      // If image already has full URL, return as is
      if (image.startsWith('http')) {
        return image;
      }
      
      // If image starts with /uploads, make it absolute path
      if (image.startsWith('/uploads')) {
        return `${API_BASE_URL}${image}`;
      }
      
      // If it's just a filename, construct the path
      return `${API_BASE_URL}/uploads/accommodations/${image}`;
    });
  };

  // Fetch accommodation data from backend
  const fetchAccommodationData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/api/accommodations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch accommodation: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const processedAccommodation = {
          ...result.accommodation,
          images: processAccommodationImages(result.accommodation.images)
        };
        
        setAccommodation(processedAccommodation);
        
        // Set main image
        if (processedAccommodation.images && processedAccommodation.images.length > 0) {
          setMainImage(processedAccommodation.images[0]);
        } else {
          setMainImage(assets.defaultAccommodation);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch accommodation details');
      }
    } catch (error) {
      console.error('Error fetching accommodation data:', error);
      setError(error.message || 'Failed to load accommodation details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodationData();
  }, [id]);

  // Handle start date selection
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

  // Handle end date selection
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

  // Calculate total days and cost
  const calculateTotal = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalDays(diffDays);
    if (accommodation) {
      const dailyRate = accommodation.pricePerMonth / 30;
      const cost = diffDays * dailyRate;
      setTotalCost(cost);
    }
  };

  // Handle book now button click
  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/accommodations/${id}` } });
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

  // Create accommodation booking
  const createAccommodationBooking = async (paymentDetails = {}) => {
    try {
      setIsBooking(true);
      
      const bookingData = {
        renter: user.id,
        accommodation: id,
        booking_start: startDate.toISOString(),
        booking_end: endDate.toISOString(),
        totalPrice: totalCost,
        securityDeposit: accommodation.SecurityDeposit,
        isPaid: true,
        paymentMethod: paymentMethod,
        ...paymentDetails
      };

      const response = await fetch(`${API_BASE_URL}/api/accommodation-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking');
      }

      if (result.success) {
        const newBooking = {
          id: result.booking._id || `a-${Date.now()}`,
          type: 'accommodation',
          item: accommodation,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          status: result.booking.booking_status || 'confirmed',
          totalPrice: totalCost,
          securityDeposit: accommodation.SecurityDeposit,
          bookingDate: new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod,
          userId: user.id,
          bookingId: result.booking._id
        };

        addBooking(newBooking);

        setStartDate(null);
        setEndDate(null);
        setTotalDays(0);
        setTotalCost(0);
        setPaymentMethod('credit_card');
        setShowPaymentPopup(false);

        alert('Booking confirmed successfully!');
        
      } else {
        throw new Error(result.message || 'Booking failed');
      }

    } catch (error) {
      console.error('Booking creation error:', error);
      setBookingError(error.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentData = {}) => {
    try {
      await createAccommodationBooking(paymentData);
    } catch (error) {
      console.error('Payment success handling error:', error);
      setBookingError('Failed to process booking after payment. Please contact support.');
    }
  };

  // Handle contact owner button click
  const handleContactOwner = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/accommodations/${id}` } });
      return;
    }

    if (!accommodation?.owner_id) {
      console.warn('No owner data available for this property');
      alert('Owner information is not currently available. Please try again later.');
      return;
    }

    setShowOwnerDetails(true);
  };

  // Prepare booking details for payment popup
  const getBookingDetails = () => {
    if (!accommodation) return null;

    const dailyRate = accommodation.pricePerMonth / 30;

    return {
      type: 'accommodation',
      itemName: `${accommodation.accommodationType} - ${accommodation.accommodationName}`,
      duration: `${totalDays} day${totalDays !== 1 ? 's' : ''}`,
      totalAmount: totalDays > 0 ? totalCost + (accommodation.SecurityDeposit || 0) : 0,
      bookingId: `ACC-${Date.now()}`,
      dailyRate: dailyRate,
      deposit: accommodation.SecurityDeposit || 0,
      rentalCost: totalCost
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="accommodation-loading">
        <div className="loading-spinner"></div>
        <p>Loading accommodation details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="accommodation-error">
        <h2 className="accommodation-error__title">Error Loading Accommodation</h2>
        <p className="accommodation-error__message">{error}</p>
        <button
          className="back-button"
          onClick={() => navigate('/accommodations')}
        >
          Browse Available Accommodations
        </button>
      </div>
    );
  }

  // Accommodation not found state
  if (!accommodation) {
    return (
      <div className="accommodation-not-found">
        <h2 className="accommodation-not-found__title">Accommodation not found</h2>
        <p className="accommodation-not-found__message">
          The accommodation you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="back-button"
          onClick={() => navigate('/accommodations')}
        >
          Browse Available Accommodations
        </button>
      </div>
    );
  }

  // Use processed images from accommodation state
  const images = accommodation.images || [];
  const owner = accommodation.owner_id;
  const dailyRate = accommodation.pricePerMonth / 30;

  return (
    <main className="accommodation-details">
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
          isLoading={isBooking}
        />
      )}

      {/* Accommodation Header Section */}
      <header className="accommodation-header">
        <h1 className="accommodation-title">
          <div className='accommodation-name'>{accommodation.accommodationName}</div>
          <div className="accommodation-type">{accommodation.accommodationType}</div>
        </h1>

        <div className="accommodation-meta">
          <StarRating rating={accommodation.averageRating || 0} />
          <span className="accommodation-review-count">
            {accommodation.totalReviews || 0} review{accommodation.totalReviews !== 1 ? 's' : ''}
          </span>
          {!accommodation.isAvailable && (
            <span className="accommodation-status-badge">Not Available</span>
          )}
          {accommodation.status && accommodation.status !== 'Active' && (
            <span className="accommodation-status-badge">{accommodation.status}</span>
          )}
        </div>

        <div className="accommodation-location">
          <img src={assets.locationIcon} alt="Location icon" className="accommodation-location__icon" />
          <span className="accommodation-location__text">
            {accommodation.location?.address || accommodation.address || 'Location not specified'}
          </span>
        </div>
      </header>

      {/* Accommodation Gallery Section */}
      <section className="accommodation-gallery">
        <div className="accommodation-gallery__main">
          <img
            src={mainImage || assets.defaultAccommodation}
            alt={accommodation.accommodationName}
            className="accommodation-gallery__main-image"
            loading="lazy"
            onError={(e) => {
              console.error('Failed to load main image:', mainImage);
              e.target.src = assets.defaultAccommodation;
            }}
          />
        </div>
        {images.length > 0 && (
          <div className="accommodation-gallery__thumbnails">
            {images.slice(0, 4).map((img, index) => (
              <button
                key={index}
                className={`accommodation-gallery__thumbnail ${mainImage === img ? 'accommodation-gallery__thumbnail--active' : ''}`}
                onClick={() => setMainImage(img)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="accommodation-gallery__thumbnail-image"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load thumbnail:', img);
                    e.target.src = assets.defaultAccommodation;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <div className="accommodation-content">
        <section className="accommodation-specs">
          {/* Accommodation Specifications */}
          <div className="accommodation-Content">
            <h2 className="accommodation-section-title">Accommodation Specifications</h2>
            <div className="specs-grid">
              <div className="specs-item">
                <span className="specs-title">Accommodation Type</span>
                <span className="specs-value">{accommodation.accommodationType}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Accommodation Name</span>
                <span className="specs-value">{accommodation.accommodationName}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Monthly Rate</span>
                <span className="specs-value">Rs {accommodation.pricePerMonth?.toLocaleString()}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Daily Rate</span>
                <span className="specs-value">Rs {dailyRate?.toLocaleString()}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Number of Beds</span>
                <span className="specs-value">{accommodation.noOfBed}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Security Deposit</span>
                <span className="specs-value">Rs {accommodation.SecurityDeposit?.toLocaleString()}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Availability</span>
                <span className={`specs-value ${accommodation.isAvailable ? 'available' : 'not-available'}`}>
                  {accommodation.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            {/* Amenities Section */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="amenities-section">
                <h3 className="specs-title">Amenities</h3>
                <div className="amenities-list">
                  {accommodation.amenities.map((item, index) => (
                    <div key={index} className="amenity-item">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address Section */}
            <div className="address-section">
              <h3 className="specs-title">Address</h3>
              <p className="specs-text">
                {accommodation.location?.address || accommodation.address || 'Address not specified'}
              </p>
            </div>

            {/* Description Section */}
            <div className="description-section">
              <h3 className="specs-title">Description</h3>
              <p className="specs-text">
                {accommodation.description || 'No description provided yet. Please check back later for more information.'}
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="accommodation-Content map">
            <h3 className="accommodation-section-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={accommodation.location?.address || accommodation.address || 'Colombo, Sri Lanka'}
                latitude={accommodation.location?.latitude}
                longitude={accommodation.location?.longitude}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <section className="accommodation-Content accommodation-reviews">
            <h2 className="accommodation-section-title">Reviews</h2>

            <div className="reviews-summary">
              <div className="reviews-overview">
                <span className="reviews-average">{(accommodation.averageRating || 0).toFixed(1)}</span>
                <StarRating rating={accommodation.averageRating || 0} />
                <span>{accommodation.totalReviews || 0} review{accommodation.totalReviews !== 1 ? 's' : ''}</span>
              </div>

              {/* Rating Distribution */}
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = accommodation.ratingCount?.[star] || 0;
                  const percentage = accommodation.totalReviews
                    ? (count / accommodation.totalReviews) * 100
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
          <section className="accommodation-Content accommodation-host">
            <h2 className="accommodation-section-title">Property Owner</h2>
            <div className="host-profile">
              <img
                src={owner?.profile_pic ? processAccommodationImages([owner.profile_pic])[0] : assets.defaultAvatar}
                alt={`${owner?.displayName || owner?.fullName || 'Property Owner'}'s profile`}
                className="host-avatar"
                onError={(e) => {
                  e.target.src = assets.defaultAvatar;
                }}
              />
              <div className="host-info">
                <h4 className="host-name">
                  Owned by {owner?.displayName || owner?.fullName || 'Property Owner'}
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
              aria-label="Contact property owner"
            >
              Contact Owner
            </button>
          </section>
        </section>

        {/* Right Column - Booking Card */}
        <aside className="accommodation-booking">
          <div className="booking-card">
            <div className="booking-card-header">
              <h3 className="accommodation-section-title">Booking</h3>
              <div className="booking-price">
                Rs {dailyRate?.toLocaleString()}
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
                  disabled={!accommodation.isAvailable}
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
                  disabled={!startDate || !accommodation.isAvailable}
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
                disabled={!accommodation.isAvailable}
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
                <span>Rs {dailyRate?.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--subtotal">
                <span>Subtotal:</span>
                <span>Rs {(totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item">
                <span>Security Deposit:</span>
                <span>Rs {accommodation.SecurityDeposit?.toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--total">
                <span>Total Amount:</span>
                <span>Rs {totalDays > 0
                  ? (totalCost + (accommodation.SecurityDeposit || 0)).toLocaleString()
                  : 0}</span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>Security Deposit: Rs {accommodation.SecurityDeposit?.toLocaleString()} (refundable when accommodation is vacated)</span>
            </div>

            <button
              className={`booking-button ${!accommodation.isAvailable ? 'booking-button--disabled' : ''}`}
              onClick={handleBookNow}
              disabled={!accommodation.isAvailable || totalDays === 0 || accommodation.status !== 'Active' || isBooking}
            >
              {isBooking ? 'Processing...' : 
               !accommodation.isAvailable ? 'Not Available' :
               accommodation.status && accommodation.status !== 'Active' ? accommodation.status :
               'Book Now'}
            </button>

            {accommodation.status && accommodation.status !== 'Active' && (
              <div className="booking-notice">
                This accommodation is currently {accommodation.status.toLowerCase()}.
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AccommodationDetails;