import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomsDummyData, assets } from '../Assets/assets';
import { useBookings } from '../Context/BookingContext';
import { AuthContext } from '../Context/AuthContext';
import StarRating from '../Components/Rating/StarRating';
import GoogleMapEmbed from '../Components/GoogleMap/GoogleMap';
import PaymentPopup from '../Components/PaymentPopup/PaymentPopup';
import OwnerDetails from './OwnerDetails';
import { scrollToTop } from './scrollToTop';
import { useInView } from 'react-intersection-observer';
import './RoomDetails.css';
import './Animation/animations.css';

const RoomDetails = () => {
  // ------------------ Routing & Context ------------------
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { isLoggedIn, user } = useContext(AuthContext);

  // ------------------ State Management ------------------
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------ Animation Hooks ------------------
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [galleryRef, galleryInView] = useInView({ threshold: 0.1 });
  const [specsRef, specsInView] = useInView({ threshold: 0.1 });
  const [bookingRef, bookingInView] = useInView({ threshold: 0.1 });
  const [reviewsRef, reviewsInView] = useInView({ threshold: 0.1 });
  const [ownerRef, ownerInView] = useInView({ threshold: 0.1 });

  // ------------------ Data Fetching ------------------
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true);
        const foundRoom = roomsDummyData.find(room => room._id === id);

        if (foundRoom) {
          setRoom(foundRoom);
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

  // ------------------ Date Handling ------------------
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
    if (room) {
      const cost = diffDays * (room.pricePerMonth / 30);
      setTotalCost(cost);
    }
  };

  // ------------------ Owner Interaction ------------------
  const handleContactOwner = () => {
    if (!isLoggedIn) {
      scrollToTop();
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

  // ------------------ Booking Handling ------------------
  const handleBookNow = () => {
    if (!isLoggedIn) {
      scrollToTop();
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
    if (!room) return null;

    return {
      type: 'room',
      itemName: `${room.roomType} at ${room.hotel.name}`,
      duration: `${totalDays} day${totalDays !== 1 ? 's' : ''}`,
      totalAmount: totalDays > 0 ? totalCost + (room.pricePerMonth * 0.1) : 0,
      bookingId: `R-${Date.now()}`
    };
  };

  // ------------------ Loading States ------------------
  if (isLoading) {
    return (
      <div className="room-loading fade-in">
        <div className="loading-spinner"></div>
        <p>Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-not-found fade-in">
        <h2 className="room-not-found__title">Room not found</h2>
        <p className="room-not-found__message">
          Please check the ID or go back to the accommodation list.
        </p>
        <button
          className="back-button pulse"
          onClick={() => navigate('/rooms')}
        >
          Browse Available Rooms
        </button>
      </div>
    );
  }

  // ------------------ Data Preparation ------------------
  const images = room.images || [];
  const owner = room.owner || {};
  const ratingDist = room.rating_distribution || {};

  return (
    <main className="room-details">
      {/* ------------------ Popup Modals ------------------ */}
      {showOwnerDetails && (
        <OwnerDetails
          owner={owner}
          onClose={() => setShowOwnerDetails(false)}
          className={ownerInView ? 'scale-up' : ''}
        />
      )}

      {showPaymentPopup && (
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          bookingDetails={getBookingDetails()}
          onPaymentSuccess={handlePaymentSuccess}
          paymentMethod={paymentMethod}
          className={bookingInView ? 'fade-in-up' : ''}
        />
      )}

      {/* ------------------ Header Section ------------------ */}
      <header 
        ref={headerRef}
        className={`room-header ${headerInView ? 'slide-in-left' : ''}`}
      >
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

      {/* ------------------ Gallery Section ------------------ */}
      <section 
        ref={galleryRef}
        className={`room-gallery ${galleryInView ? 'scale-up delay-100' : ''}`}
      >
        <div className="room-gallery__main">
          <img
            src={images[selectedImageIndex]}
            alt={`${room.roomType} at ${room.hotel.name}`}
            className="room-gallery__main-image"
            loading="lazy"
          />
        </div>
        <div className="room-gallery__thumbnails">
          {images.slice(0, 4).map((img, index) => (
            <button
              key={index}
              className={`room-gallery__thumbnail ${index === selectedImageIndex ? 'room-gallery__thumbnail--active' : ''}`}
              onClick={() => setSelectedImageIndex(index)}
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

      {/* ------------------ Main Content ------------------ */}
      <div className="room-content">
        {/* ------------------ Specifications Section ------------------ */}
        <section 
          ref={specsRef}
          className={`room-specs ${specsInView ? 'slide-in-left delay-200' : ''}`}
        >
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

          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">
              {room.description || 'No description provided yet. Please check back later for more information.'}
            </p>
          </div>

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

        {/* ------------------ Booking Section ------------------ */}
        <aside 
          ref={bookingRef}
          className={`room-booking ${bookingInView ? 'slide-in-right delay-200' : ''}`}
        >
          <div className="booking-card">
            <div className="booking-price">
              <span className="booking-price__amount">
                Rs {(room.pricePerMonth / 30).toLocaleString()}
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
              {bookingError && <div className="booking-error fade-in">{bookingError}</div>}
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

      {/* ------------------ Secondary Sections ------------------ */}
      <div className="room-secondary">
        {/* ------------------ Reviews Section ------------------ */}
        <section 
          ref={reviewsRef}
          className={`room-reviews ${reviewsInView ? 'slide-in-left delay-300' : ''}`}
        >
          <h2 className="room-section-title">Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-overview">
              <span className="reviews-average">{room.rating}</span>
              <StarRating rating={room.rating} />
              <span>{room.reviews || 200}+ reviews</span>
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

        {/* ------------------ Owner Section ------------------ */}
        <section 
          ref={ownerRef}
          className={`room-owner ${ownerInView ? 'slide-in-right delay-300' : ''}`}
        >
          <h2 className="room-section-title">Room Owner</h2>
          <div className="owner-profile">
            <img
              src={owner.profile_pic || assets.defaultAvatar}
              alt={owner.name || 'Room owner'}
              className="owner-avatar"
            />
            <div className="owner-info">
              <h4 className="owner-name">Owned by {owner.name || 'Private Owner'}</h4>
              <div className="owner-rating">
                <StarRating rating={room.rating} size="small" />
                <span>{room.reviews} reviews</span>
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
            aria-label="Contact room owner"
          >
            Contact Owner
          </button>
        </section>
      </div>
    </main>
  );
};

export default RoomDetails;