import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { accommodationsData, assets } from '../../Assets/assets';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import StarRating from '../../Components/Rating/StarRating';
import GoogleMapEmbed from '../../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from './OwnerDetails';
import './AccommodationDetails.css';

// Default owner data structure
const defaultOwner = {
  name: 'Property Owner',
  email: 'contact@example.com',
  phone: '+94 77 4571 055',
  joinDate: '2020-05-15',
  avatar: assets.hostIcon,
  rating: 4.8,
  reviews: 42,
};


const AccommodationDetails = () => {
  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // Context hooks
  const { addBooking } = useBookings();
  const { isLoggedIn, user } = useContext(AuthContext);

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
  const [ownerData, setOwnerData] = useState(defaultOwner);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch accommodation data on component mount
  useEffect(() => {
    const fetchAccommodationData = async () => {
      try {
        setIsLoading(true);
        const foundAccommodation = accommodationsData.find(accommodation => accommodation._id === id);

        if (foundAccommodation) {
          setAccommodation(foundAccommodation);
          setMainImage(foundAccommodation.images[0]);
          setOwnerData({
            ...defaultOwner,
            ...foundAccommodation.owner
          });
        } else {
          throw new Error('Accommodation not found');
        }
      } catch (error) {
        console.error('Error fetching accommodation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
      const cost = diffDays * (accommodation.pricePerMonth / 30);
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

  // Handle successful payment
  const handlePaymentSuccess = () => {
    const newBooking = {
      id: `r-${Date.now()}`,
      type: 'accommodation',
      item: accommodation,
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
      navigate('/login', { state: { from: `/accommodations/${id}` } });
      return;
    }

    if (!accommodation?.owner) {
      console.warn('No owner data available for this property');
      alert('Owner information is not currently available. Please try again later.');
      return;
    }

    setShowOwnerDetails(true);
  };

  // Prepare booking details for payment popup
  const getBookingDetails = () => {
    if (!accommodation) return null;

    return {
      type: 'accommodation',
      itemName: `${accommodation.accommodationType}`,
      duration: `${totalDays} day${totalDays !== 1 ? 's' : ''}`,
      totalAmount: totalDays > 0 ? totalCost + (accommodation.pricePerMonth * 0.1) : 0,
      bookingId: `R-${Date.now()}`
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

  // Accommodation not found state
  if (!accommodation) {
    return (
      <div className="accommodation-not-found">
        <h2 className="accommodation-not-found__title">Accommodation not found</h2>
        <p className="accommodation-not-found__message">
          Please check the ID or go back to the accommodation list.
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

  const images = accommodation.images || [];

  return (
    <main className="accommodation-details">
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

      {/* ---------------------------- Accommodation Header Section ---------------------------- */}
      <header className="accommodation-header">
        <h1 className="accommodation-title">
          <div className='accommodation-name'>{accommodation.accommodationName}</div>
          <div className="accommodation-type">{accommodation.accommodationType}</div>
        </h1>

        <div className="accommodation-meta">
          <StarRating rating={accommodation.rating} />
          <span className="accommodation-review-count">{accommodation.totalReviews || 200} + reviews</span>
        </div>

        <div className="accommodation-location">
          <img src={assets.locationIcon} alt="Location icon" className="accommodation-location__icon" />
          <span className="accommodation-location__text">{accommodation.location}</span>
        </div>
      </header>

      {/* ---------------------------- Accommodation Gallery Section ---------------------------- */}
      <section className="accommodation-gallery">
        <div className="accommodation-gallery__main">
          <img
            src={mainImage}
            alt={`${accommodation.name}`}
            className="accommodation-gallery__main-image"
            loading="lazy"
          />
        </div>
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
              />
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------------- Main Content Area ---------------------------- */}
      <div className="accommodation-content">

        <section className="accommodation-specs">
          {/* ---------- Accommodation Specifications ---------- */}
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
                <span className="specs-title">Price</span>
                <span className="specs-value">Rs {accommodation.pricePerMonth.toLocaleString()}/month</span>
              </div>

              <div className="specs-item">
                <span className="specs-title">No of Bed</span>
                <span className="specs-value">{accommodation.noOfBed}</span>
              </div>

            </div>



            {/* Amenities Section */}
            <div className="amenities-section">
              <h3 className="specs-title">Amenities</h3>
              <div className="amenities-list">
                {accommodation.amenities?.map((item, index) => (
                  <div key={index} className="amenity-item">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="description-section">
              <h3 className="specs-title">Address</h3>
              <p className="specs-text">{accommodation.location}</p>
            </div>

            {/*  Description Section  */}
            <div className="description-section">
              <h3 className="specs-title">Description</h3>
              <p className="specs-text">
                {accommodation.description || 'No description provided yet. Please check back later for more information.'}
              </p>
            </div>
          </div>


          {/* ---------- Map Section ---------- */}
          <div className="accommodation-Content map">
            <h3 className="accommodation-section-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={accommodation.location}
              />
            </div>
          </div>

          {/* ---------- Reviews ----------  */}
          <section className="accommodation-Content accommodation-reviews">
            <h2 className="accommodation-section-title">Reviews</h2>

            <div className="reviews-summary">
              <div className="reviews-overview">
                <span className="reviews-average">{accommodation.averageRating.toFixed(1)}</span>
                <StarRating rating={accommodation.averageRating} />
                <span>{accommodation.totalReviews} + reviews</span>
              </div>

              {/* Rating Distribution */}
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = accommodation.ratingCount[star] || 0;
                  const percentage = accommodation.totalReviews
                    ? (count / accommodation.totalReviews) * 100
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
          <section className="accommodation-Content accommodation-host">
            <h2 className="accommodation-section-title">Accommodation Owner</h2>
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
              aria-label="Contact property owner"
            >
              Contact Host
            </button>
          </section>
        </section>

        {/* ---------------------------- Right Column - Booking Card ---------------------------- */}
        <aside className="accommodation-booking">
          <div className="booking-card">
            <div className="accommodation-section-title">
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
                <span>Rs {(accommodation.pricePerMonth / 30).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--subtotal">
                <span>Subtotal:</span>
                <span>Rs {(totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item">
                <span>Security Deposit:</span>
                <span>Rs {(accommodation.SecurityDeposit).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--total">
                <span>Total Amount:</span>
                <span>Rs {totalDays > 0
                  ? (totalCost + (accommodation.pricePerMonth * 0.1)).toLocaleString()
                  : 0}</span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>Security Deposit: Rs {(accommodation.SecurityDeposit).toLocaleString()} (refundable when accommodation is vacated)</span>
            </div>

            <button
              className="booking-button"
              onClick={handleBookNow}
              disabled={totalDays === 0}
            >
              Book Now
            </button>
          </div>
        </aside>
      </div>

    </main>
  );
};

export default AccommodationDetails;