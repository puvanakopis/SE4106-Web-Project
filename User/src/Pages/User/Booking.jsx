import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../../Context/BookingContext';
import { AuthContext } from '../../Context/AuthContext';
import Feedback from './Feedback';
import StarRating from '../../Components/Rating/StarRating';
import { scrollToTop } from '../scrollToTop';
import './Booking.css';

const Booking = () => {
  // ------------------ Navigation and Authentication ------------------
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  // ------------------ Booking Data and Context ------------------
  const { bookings, updateBookingStatus } = useBookings();
  const upcomingBookings = bookings.upcoming || [];
  const pastBookings = bookings.past || [];

  // ------------------ UI State ------------------
  const [activeTab, setActiveTab] = useState('upcoming');
  const [animateContent, setAnimateContent] = useState(false);

  // ------------------ Pagination State ------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ------------------ Feedback Modal State ------------------
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------ Derived Values ------------------
  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  const totalPages = Math.ceil(currentBookings.length / itemsPerPage);
  const paginatedBookings = currentBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ------------------ Authentication Effect ------------------
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // ------------------ Animation Effect ------------------
  useEffect(() => {
    setAnimateContent(true);
    const timer = setTimeout(() => setAnimateContent(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  /* ------------------ Format date for display ------------------ */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /* ------------------ Calculate duration in days ------------------ */
  const calculateDays = (startDate, endDate) => {
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  /* ------------------ Handle booking cancellation ------------------ */
  const cancelBooking = (bookingId, e) => {
    e.stopPropagation();
    alert(`Booking ${bookingId} cancellation requested`);
  };

  /* ------------------ Initiate feedback process ------------------ */
  const handleCompleteClick = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setRating(0);
    setFeedback('');
    setShowRatingPopup(true);
  };

  /* ------------------ Submit feedback and rating ------------------ */
  const handleRatingSubmit = async (ratingData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting feedback for booking:', selectedBooking.id, ratingData);
      await updateBookingStatus(selectedBooking.id, 'completed');
      setShowRatingPopup(false);
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------ Close feedback modal ------------------ */
  const handleCloseFeedback = () => {
    setShowRatingPopup(false);
  };

  /* ------------------ Change active tab ------------------ */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    scrollToTop();
  };

  /* ------------------ Handle pagination ------------------ */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="booking-main-container fade-in">
      {/* --------------------------- Booking Header --------------------------- */}
      <div className="booking-profile">
        <div className="booking-header slide-in-left delay-100">
          <div>Your Bookings</div>
        </div>


        {/* --------------------------- Main Booking Container --------------------------- */}
        <div className="booking-container fade-in delay-200">

          {/* --------------------------- Sidebar Navigation --------------------------- */}
          <div className="booking-sidebar slide-in-left delay-300">
            <div
              onClick={() => handleTabChange('upcoming')}
              className={`booking-title ${activeTab === 'upcoming' ? 'active' : ''}`}
            >
              Upcoming
            </div>
            <div
              onClick={() => handleTabChange('past')}
              className={`booking-title ${activeTab === 'past' ? 'active' : ''}`}
            >
              Past
            </div>
          </div>

          {/* --------------------------- Booking Content --------------------------- */}
          <div className={`booking-content ${animateContent ? 'slide-in-right' : ''}`}>


            {/* --------------------------- No Bookings Message --------------------------- */}
            {currentBookings.length === 0 ? (
              <div className="no-bookings fade-in delay-100">
                <h3>No {activeTab === 'upcoming' ? 'upcoming' : 'past'} bookings</h3>
                <p>
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming bookings yet"
                    : "You haven't made any past bookings"}
                </p>
                <button
                  className="browse-button fade-in delay-200"
                  onClick={() => {
                    navigate(activeTab === 'upcoming' ? '/room' : '/transport')
                    scrollToTop();
                  }}
                >
                  Browse {activeTab === 'upcoming' ? 'Rooms' : 'Transport'}
                </button>
              </div>
            ) : (
              <>

                {/* --------------------------- Booking Cards Grid --------------------------- */}
                <div className="booking-grid">
                  {paginatedBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className={`card ${booking.type === 'room' ? 'accommodation-card' : 'vehicle-card'} ${booking.type === 'vehicle' ? booking.item.vehicle_type.toLowerCase() : ''} fade-in delay-${(index % 6) + 1}00`}
                      onClick={() => { navigate(`/${booking.type}/${booking.item.vehicle_id || booking.item._id}`); scrollToTop(); }}
                    >
                      <img
                        src={
                          booking.type === 'room'
                            ? booking.item.images[0]
                            : booking.item.vehicle_images[0]
                        }
                        alt={
                          booking.type === 'room'
                            ? `${booking.item.roomType} in ${booking.item.hotel?.name || 'Unknown'}`
                            : `${booking.item.brand} ${booking.item.model}`
                        }
                        className="card-image"
                      />
                      <div className="property-badge">
                        {booking.type === 'room'
                          ? booking.item.roomType
                          : booking.item.vehicle_type}
                      </div>
                      <div className={`status-badge ${booking.status}`}>{booking.status}</div>
                      <div className="card-info">
                        {booking.type === 'room' ? (
                          <>
                            <h3>{booking.item.roomType} at {booking.item.hotel?.name || 'Unknown'}</h3>
                            <p>Location – {booking.item.hotel?.city || 'Unknown'}</p>
                            <div className="rating">
                              <StarRating rating={booking.item.rating} />
                              <span>{booking.item.review_count || '200+'} reviews</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3>{booking.item.brand} {booking.item.model}</h3>
                            <div className="specs">
                              <p>Fuel – {booking.item.fuel_type}</p>
                              <p>Seats – {booking.item.seating_capacity}</p>
                            </div>
                            <div className="rating">
                              <StarRating rating={booking.item.average_rating} />
                              <span>{booking.item.review_count || '200+'} reviews</span>
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
                        </div>
                        <div className="price-action">
                          <p>
                            {booking.type === 'room'
                              ? `Rs ${booking.totalPrice.toLocaleString()}/= for ${calculateDays(booking.startDate, booking.endDate)} nights`
                              : `Rs ${booking.totalPrice.toLocaleString()}/= for ${calculateDays(booking.startDate, booking.endDate)} days`}
                          </p>
                          {activeTab === 'upcoming' && (
                            <div className="action-buttons">
                              <button
                                className="cancel-btn"
                                onClick={(e) => cancelBooking(booking.id, e)}
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>


                {/* --------------------------- Pagination Controls --------------------------- */}
                {totalPages > 1 && (
                  <div className="pagination fade-in delay-700">
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


      {/* --------------------------- Feedback Modal --------------------------- */}
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