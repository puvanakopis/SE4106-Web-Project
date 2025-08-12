import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { assets, vehicleData } from '../../Assets/assets';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import StarRating from '../../Components/Rating/StarRating';
import GoogleMapEmbed from '../../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from '../OwnerDetails';
import { scrollToTop } from '../scrollToTop';
import './TransportDetails.css';

// Default owner data structure
const defaultOwner = {
  name: 'Vehicle Owner',
  email: 'contact@example.com',
  phone: '+1 (555) 123-4567',
  joinDate: '2020-05-15',
  avatar: assets.hostIcon,
  rating: 4.8,
  reviews: 42,
};

const TransportDetails = () => {
  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // Context hooks
  const { addBooking } = useBookings();
  const { isLoggedIn, user } = useContext(AuthContext);

  // State management
  const [vehicle, setVehicle] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [ownerData, setOwnerData] = useState(defaultOwner);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vehicle data on component mount
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const foundVehicle = vehicleData.find(v => v.vehicle_id === id);

        if (foundVehicle) {
          setVehicle(foundVehicle);
          setMainImage(foundVehicle.vehicle_images[0]);
          setOwnerData({
            ...defaultOwner,
            ...foundVehicle.owner
          });
        } else {
          throw new Error('Vehicle not found');
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
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
    if (vehicle) {
      const cost = diffDays * vehicle.rental_price_per_day;
      setTotalCost(cost);
    }
  };

  // Handle book now button click
  const handleBookNow = () => {
    if (!isLoggedIn) {
      scrollToTop()
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

  // Handle successful payment
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
    setStartDate(null);
    setEndDate(null);
    setTotalDays(0);
    setTotalCost(0);
    setPaymentMethod('credit_card');
    setShowPaymentPopup(false);
  };

  // Handle contact owner button click
  const handleContactOwner = () => {
    if (!isLoggedIn) {
      scrollToTop()
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

  // Prepare booking details for payment popup
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

  // Loading state
  if (isLoading) {
    return (
      <div className="transport-loading">
        <div className="loading-spinner"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  // Vehicle not found state
  if (!vehicle) {
    return (
      <div className="transport-not-found">
        <h2 className="transport-not-found__title">Vehicle not found</h2>
        <p className="transport-not-found__message">
          Please check the ID or go back to the transport list.
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

  const images = vehicle.vehicle_images || [];

  return (
    <main className="transport-details">
      {/* ---------------------------- Owner Details Modal ---------------------------- */}
      {showOwnerDetails && (
        <OwnerDetails
          owner={ownerData}
          onClose={() => setShowOwnerDetails(false)}
        />
      )}

      {/* ---------------------------- Payment Popup Modal ---------------------------- */}
      {showPaymentPopup && (
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          bookingDetails={getBookingDetails()}
          onPaymentSuccess={handlePaymentSuccess}
          paymentMethod={paymentMethod}
        />
      )}

      {/* ---------------------------- Vehicle Header Section ---------------------------- */}
      <header className="transport-header">
        <h1 className="transport-title">
          <div className='transport-name'>{vehicle.brand} {vehicle.model}</div>
          <div className="transport-type">{vehicle.vehicle_type}</div>
        </h1>

        <div className="transport-meta">
          <StarRating rating={vehicle.averageRating} />
          <span className="transport-review-count">{vehicle.totalReviews || 200} + reviews</span>
        </div>

        <div className="transport-location">
          <img src={assets.locationIcon} alt="Location icon" className="transport-location__icon" />
          <span className="transport-location__text">{vehicle.address}</span>
        </div>
      </header>

      {/* ---------------------------- Vehicle Gallery Section ---------------------------- */}
      <section className="transport-gallery">
        <div className="transport-gallery__main">
          <img
            src={mainImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="transport-gallery__main-image"
            loading="lazy"
          />
        </div>
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
              />
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------------- Main Content Area ---------------------------- */}
      <div className="transport-content">

        <section className="transport-specs">
          {/* ---------- Vehicle Specifications ---------- */}
          <div className="transport-Content">
            <h2 className="transport-section-title">Vehicle Specifications</h2>
            <div className="specs-grid">
              <div className="specs-item">
                <span className="specs-title">Vehicle Type</span>
                <span className="specs-value">{vehicle.vehicle_type}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Brand</span>
                <span className="specs-value">{vehicle.brand}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Model</span>
                <span className="specs-value">{vehicle.model}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Year</span>
                <span className="specs-value">{vehicle.year}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Fuel Type</span>
                <span className="specs-value">{vehicle.fuel_type}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Seating Capacity</span>
                <span className="specs-value">{vehicle.seating_capacity}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Registration Number</span>
                <span className="specs-value">{vehicle.registration_number}</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">Daily Rate</span>
                <span className="specs-value">Rs {vehicle.rental_price_per_day.toLocaleString()}</span>
              </div>
            </div>

            {/* Features Section */}
            <div className="specs-item">
              <h3 className="specs-title">Features</h3>
              <div className="features-list ">
                {vehicle.features?.map((item, index) => (
                  <div key={index} className="specs-value">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="address-section">
              <h3 className="specs-title">Address</h3>
              <p className="specs-text">{vehicle.address}</p>
            </div>

            {/*  Description Section  */}
            <div className="description-section">
              <h3 className="specs-title">Description</h3>
              <p className="specs-text">
                {vehicle.description || 'No description provided yet. Please check back later for more information.'}
              </p>
            </div>
          </div>


          {/* ---------- Map Section ---------- */}
          <div className="transport-Content map">
            <h3 className="transport-section-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={vehicle.address}
              />
            </div>
          </div>

          {/* ---------- Reviews ----------  */}
          <section className="transport-Content transport-reviews">
            <h2 className="transport-section-title">Reviews</h2>

            <div className="reviews-summary">
              <div className="reviews-overview">
                <span className="reviews-average">{vehicle.averageRating.toFixed(1)}</span>
                <StarRating rating={vehicle.averageRating} />
                <span>{vehicle.totalReviews} + reviews</span>
              </div>

              {/* Rating Distribution */}
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = vehicle.ratingCount[star] || 0;
                  const percentage = vehicle.totalReviews
                    ? (count / vehicle.totalReviews) * 100
                    : 0;

                  return (
                    <div className="rating-row" key={star}>
                      <span className="star-label">{star}</span>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>


          {/* ---------- Owner ---------- */}
          <section className="transport-Content transport-host">
            <h2 className="transport-section-title">Vehicle Owner</h2>
            <div className="host-profile">
              <img
                src={ownerData.profile_pic || assets.defaultAvatar}
                alt={`${ownerData.DisplayName}'s profile`}
                className="host-avatar"
              />
              <div className="host-info">
                <h4 className="host-name">Owned by {ownerData.DisplayName}</h4>
                <div className="host-rating">
                  <StarRating rating={ownerData.averageRating} size="small" />
                  <span>{ownerData.totalReviews} + reviews</span>
                </div>
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

        {/* ---------------------------- Right Column - Booking Card ---------------------------- */}
        <aside className="transport-booking">
          <div className="booking-card">
            <div className="transport-section-title">
              Booking
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
              disabled={!vehicle.isAvailable || totalDays === 0}
            >
              {vehicle.isAvailable ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default TransportDetails;