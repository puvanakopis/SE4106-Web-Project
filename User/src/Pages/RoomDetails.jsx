import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { roomsDummyData, assets } from '../Assets/assets';
import { useBookings } from '../Context/BookingContext';
import { AuthContext } from '../Context/AuthContext';
import StarRating from '../Components/Rating/StarRating';
import GoogleMapEmbed from '../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from './OwnerDetails';
import './RoomDetails.css';

// Default owner data structure
const defaultOwner = {
  name: 'Property Owner',
  email: 'contact@example.com',
  phone: '+1 (555) 123-4567',
  joinDate: '2020-05-15',
  avatar: assets.hostIcon,
  rating: 4.8,
  reviews: 42,
  responseRate: '98%',
  responseTime: 'within an hour'
};


const RoomDetails = () => {
  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // Context hooks
  const { addBooking } = useBookings();
  const { isLoggedIn, user } = useContext(AuthContext);

  // State management
  const [room, setRoom] = useState(null);
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

  // Fetch room data on component mount
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true);
        const foundRoom = roomsDummyData.find(room => room._id === id);

        if (foundRoom) {
          setRoom(foundRoom);
          setMainImage(foundRoom.images[0]);
          setOwnerData({
            ...defaultOwner,
            ...foundRoom.owner
          });
        } else {
          throw new Error('Room not found');
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
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
    if (room) {
      const cost = diffDays * (room.pricePerMonth / 30);
      setTotalCost(cost);
    }
  };

  // Handle book now button click
  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
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
      type: 'room',
      item: room,
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
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (!room?.owner) {
      console.warn('No owner data available for this property');
      alert('Owner information is not currently available. Please try again later.');
      return;
    }

    setShowOwnerDetails(true);
  };

  // Prepare booking details for payment popup
  const getBookingDetails = () => {
    if (!room) return null;

    return {
      type: 'room',
      itemName: `${room.roomType} at ${room.hotel.name}`,
      duration: `${totalDays} day${totalDays !== 1 ? 's' : ''}`,
      totalAmount: totalDays > 0 ? totalCost + (room.pricePerMonth * 0.1) : 0,
      bookingId: `R-${Date.now()}`
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="room-loading">
        <div className="loading-spinner"></div>
        <p>Loading room details...</p>
      </div>
    );
  }

  // Room not found state
  if (!room) {
    return (
      <div className="room-not-found">
        <h2 className="room-not-found__title">Room not found</h2>
        <p className="room-not-found__message">
          Please check the ID or go back to the accommodation list.
        </p>
        <button
          className="back-button"
          onClick={() => navigate('/rooms')}
        >
          Browse Available Rooms
        </button>
      </div>
    );
  }

  const images = room.images || [];

  return (
    <main className="room-details">
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

      {/* ---------------------------- Room Header Section ---------------------------- */}
      <header className="room-header">
        <h1 className="room-title">
          <div className='room-name'>{room.hotel.name}</div>
          <div className="room-type">{room.roomType}</div>
        </h1>

        <div className="room-meta">
          <StarRating rating={room.rating} />
          <span className="room-review-count">{room.reviews || 200}+ reviews</span>
        </div>

        <div className="room-location">
          <img src={assets.locationIcon} alt="Location icon" className="room-location__icon" />
          <span className="room-location__text">{room.hotel.address}</span>
        </div>
      </header>

      {/* ---------------------------- Room Gallery Section ---------------------------- */}
      <section className="room-gallery">
        <div className="room-gallery__main">
          <img
            src={mainImage}
            alt={`${room.roomType} at ${room.hotel.name}`}
            className="room-gallery__main-image"
            loading="lazy"
          />
        </div>
        <div className="room-gallery__thumbnails">
          {images.slice(0, 4).map((img, index) => (
            <button
              key={index}
              className={`room-gallery__thumbnail ${mainImage === img ? 'room-gallery__thumbnail--active' : ''}`}
              onClick={() => setMainImage(img)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="room-gallery__thumbnail-image"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------------- Main Content Area ---------------------------- */}
      <div className="room-content">
        {/* ---------------------------- Room Specifications ---------------------------- */}
        <section className="room-specs">
          <h2 className="room-section-title">Room Specifications</h2>
          <div className="specs-grid">
            <div className="specs-item">
              <span className="specs-label">Room Type</span>
              <span className="specs-value">{room.roomType}</span>
            </div>
            <div className="specs-item">
              <span className="specs-label">Hotel</span>
              <span className="specs-value">{room.hotel.name}</span>
            </div>
            <div className="specs-item">
              <span className="specs-label">Location</span>
              <span className="specs-value">{room.hotel.city}</span>
            </div>
            <div className="specs-item">
              <span className="specs-label">Price</span>
              <span className="specs-value">Rs {room.pricePerMonth.toLocaleString()}/month</span>
            </div>
            <div className="specs-item">
              <span className="specs-label">Rating</span>
              <span className="specs-value">{room.rating} / 5</span>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="amenities-section">
            <h3 className="amenities-title">Amenities</h3>
            <div className="amenities-list">
              {room.amenities?.map((item, index) => (
                <div key={index} className="amenity-item">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/*  Description Section  */}
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">
              {room.description || 'No description provided yet. Please check back later for more information.'}
            </p>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h3 className="map-title">Location</h3>
            <div className="map-container">
              <GoogleMapEmbed
                address={room.hotel.address}
                city={room.hotel.city}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------- Right Column - Booking Card ---------------------------- */}
        <aside className="room-booking">
          <div className="booking-card">
            <div className="booking-price">
              <span className="booking-price__amount">
                Rs {(room.pricePerMonth / 30).toLocaleString()}
              </span>
              <span className="booking-price__label">Per day</span>
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

            <div className="booking-summary">
              <div className="booking-summary__item">
                <span>Rental Days:</span>
                <span>{totalDays || 0} day{totalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="booking-summary__item">
                <span>Daily Rate:</span>
                <span>Rs {(room.pricePerMonth / 30).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--subtotal">
                <span>Subtotal:</span>
                <span>Rs {(totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item">
                <span>Security Deposit:</span>
                <span>Rs {(room.pricePerMonth * 0.1).toLocaleString()}</span>
              </div>
              <div className="booking-summary__item booking-summary__item--total">
                <span>Total Amount:</span>
                <span>Rs {totalDays > 0
                  ? (totalCost + (room.pricePerMonth * 0.1)).toLocaleString()
                  : 0}</span>
              </div>
            </div>

            <div className="booking-deposit">
              <span>Security Deposit: Rs {(room.pricePerMonth * 0.1).toLocaleString()} (refundable when room is vacated)</span>
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

      {/* ---------------------------- Reviews and Host Info ---------------------------- */}
      <div className="room-secondary">
        {/* Reviews Section */}
        <section className="room-reviews">
          <h2 className="room-section-title">Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-overview">
              <span className="reviews-average">{room.rating}</span>
              <StarRating rating={room.rating} />
              <span>{room.reviews || 200}+ reviews</span>
            </div>
          </div>
        </section>

        {/* Host Information Section */}
        <section className="room-host">
          <h2 className="room-section-title">Room Owner</h2>
          <div className="host-profile">
            <img
              src={ownerData.profile_pic || assets.defaultAvatar}
              alt={`${ownerData.name}'s profile`}
              className="host-avatar"
            />
            <div className="host-info">
              <h4 className="host-name">Owned by {ownerData.name}</h4>
              <div className="host-rating">
                <StarRating rating={ownerData.rating} size="small" />
                <span>{ownerData.reviews} reviews</span>
              </div>
              <div className="host-response-info">
                <span>Response rate: {ownerData.responseRate}</span>
                <span>Response time: {ownerData.responseTime}</span>
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
      </div>
    </main>
  );
};

RoomDetails.propTypes = {
  id: PropTypes.string
};

export default RoomDetails;