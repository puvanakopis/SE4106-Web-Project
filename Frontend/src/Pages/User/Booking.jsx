import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import Feedback from './Feedback';
import StarRating from '../../Components/Rating/StarRating';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useBookings();
  const { isLoggedIn } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Process bookings data
  const processBookings = () => {
    const upcoming = [];
    const past = [];

    // Process room bookings
    bookings.roomBookings.forEach(booking => {
      const bookingData = {
        id: booking._id,
        type: 'room',
        item: booking.room,
        owner: booking.owner,
        renter: booking.renter,
        startDate: booking.booking_start,
        endDate: booking.booking_end,
        totalPrice: booking.totalPrice,
        status: booking.booking_status.toLowerCase(),
        isPaid: booking.isPaid,
        rating: booking.rating,
        feedback: booking.feedback
      };

      if (bookingData.status === 'completed' || bookingData.status === 'cancelled') {
        past.push(bookingData);
      } else {
        upcoming.push(bookingData);
      }
    });

    // Process vehicle bookings
    bookings.vehicleBookings.forEach(booking => {
      const bookingData = {
        id: booking._id,
        type: 'vehicle',
        item: booking.vehicle,
        owner: booking.owner,
        renter: booking.renter,
        startDate: booking.booking_start,
        endDate: booking.booking_end,
        totalPrice: booking.totalPrice,
        status: booking.booking_status.toLowerCase(),
        isPaid: booking.isPaid,
        rating: booking.rating,
        feedback: booking.feedback
      };

      if (bookingData.status === 'completed' || bookingData.status === 'cancelled') {
        past.push(bookingData);
      } else {
        upcoming.push(bookingData);
      }
    });

    return { upcoming, past };
  };

  const { upcoming, past } = processBookings();

  // Get current bookings based on active tab
  const currentBookings = activeTab === 'upcoming' ? upcoming : past;

  const totalPages = Math.ceil(currentBookings.length / itemsPerPage);

  const paginatedBookings = currentBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDays = (startDate, endDate) => {
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const cancelBooking = (bookingId, type, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(bookingId, type, 'cancelled');
      alert('Booking cancelled successfully');
    }
  };

  const handleCompleteClick = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setRating(booking.rating || 0);
    setFeedback(booking.feedback || '');
    setShowRatingPopup(true);
  };

  const handleRatingSubmit = async (ratingData) => {
    setIsSubmitting(true);
    try {
      await updateBookingStatus(selectedBooking.id, selectedBooking.type, 'completed', {
        rating: ratingData.rating,
        feedback: ratingData.feedback
      });
      setShowRatingPopup(false);
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowRatingPopup(false);
  };

  const getBookingImage = (booking) => {
    if (booking.type === 'room') {
      return booking.item.images?.[0] || 'default-room.jpg';
    } else {
      return booking.item.vehicle_images?.[0] || 'default-vehicle.jpg';
    }
  };

  const getBookingTitle = (booking) => {
    if (booking.type === 'room') {
      return `${booking.item.roomType} at ${booking.item.roomName || 'Unknown'}`;
    } else {
      return `${booking.item.brand} ${booking.item.model}`;
    }
  };

  const getBookingLocation = (booking) => {
    if (booking.type === 'room') {
      return booking.item.location || 'Unknown location';
    } else {
      return booking.item.address || 'Unknown address';
    }
  };

  return (
    <main className="booking-main-container">
      <div className="booking-profile">
        <div className="booking-header">
          <div>Your Bookings</div>
        </div>

        <div className="booking-container">
          <div className="booking-sidebar">
            <div
              onClick={() => {
                setActiveTab('upcoming');
                setCurrentPage(1);
              }}
              className={`booking-title ${activeTab === 'upcoming' ? 'active' : ''}`}
            >
              Upcoming
            </div>
            <div
              onClick={() => {
                setActiveTab('past');
                setCurrentPage(1);
              }}
              className={`booking-title ${activeTab === 'past' ? 'active' : ''}`}
            >
              Past
            </div>
          </div>

          <div className="booking-content">
            {currentBookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No {activeTab === 'upcoming' ? 'upcoming' : 'past'} bookings</h3>
                <p>
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming bookings yet"
                    : "You haven't made any past bookings"}
                </p>
                <button
                  className="browse-button"
                  onClick={() => navigate(activeTab === 'upcoming' ? '/room' : '/transport')}
                >
                  Browse {activeTab === 'upcoming' ? 'Rooms' : 'Transport'}
                </button>
              </div>
            ) : (
              <>
                <div className="booking-grid">
                  {paginatedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`card ${booking.type === 'room' ? 'accommodation-card' : 'vehicle-card'} ${booking.type === 'vehicle' ? booking.item.vehicle_type.toLowerCase() : ''}`}
                      onClick={() => navigate(`/${booking.type}/${booking.item._id || booking.item.vehicle_id}`)}
                    >
                      <img
                        src={getBookingImage(booking)}
                        alt={getBookingTitle(booking)}
                        className="card-image"
                      />
                      <div className="property-badge">
                        {booking.type === 'room'
                          ? booking.item.roomType
                          : booking.item.vehicle_type}
                      </div>
                      <div className={`status-badge ${booking.status}`}>{booking.status}</div>
                      <div className="card-info">
                        <h3>{getBookingTitle(booking)}</h3>
                        <p>Location – {getBookingLocation(booking)}</p>

                        {booking.type === 'room' ? (
                          <div className="rating">
                            <StarRating rating={booking.item.averageRating || 0} />
                            <p>{booking.item.totalReviews || '0'}+ reviews</p>
                          </div>
                        ) : (
                          <>

                            <div className="rating">
                              <StarRating rating={booking.item.averageRating || 0} />
                              <p>{booking.item.totalReviews || '0'} + reviews</p>
                            </div>
                          </>
                        )}

                        <div className="booking-dates">
                          <p>
                            <span>From:</span> {formatDate(booking.startDate)}
                          </p>
                          <p>
                            <span>To:</span> {formatDate(booking.endDate)}
                          </p>
                          <p>
                            {booking.type === 'room'
                              ? `Rs ${booking.totalPrice.toLocaleString()}/= for ${calculateDays(booking.startDate, booking.endDate)} nights`
                              : `Rs ${booking.totalPrice.toLocaleString()}/= for ${calculateDays(booking.startDate, booking.endDate)} days`}
                          </p>
                        </div>
                        <div className="rating-action">
                          
                          {activeTab === 'upcoming' && (
                            <div className="action-buttons">
                              <button
                                className="cancel-btn"
                                onClick={(e) => cancelBooking(booking.id, booking.type, e)}
                              >
                                Cancel
                              </button>
                              <button
                                className="complete-btn"
                                onClick={(e) => handleCompleteClick(booking, e)}
                              >
                                Complete
                              </button>

                            </div>
                          )}
                          {activeTab === 'past' && booking.rating && (
                            <div className="past-rating">
                              <p>Your Rating</p>
                              <StarRating rating={booking.rating} />
                              {booking.feedback && <p className="feedback-text">"{booking.feedback}"</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-arrow"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-arrow"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showRatingPopup && (
        <Feedback
          rating={rating}
          editable={true}
          onRatingChange={setRating}
          onClose={handleCloseFeedback}
          onSubmit={handleRatingSubmit}
          feedback={feedback}
          onFeedbackChange={setFeedback}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  );
};

export default Booking;