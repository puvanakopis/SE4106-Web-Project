import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import Feedback from './Feedback';
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


  const upcomingBookings = bookings.upcoming || [];
  const pastBookings = bookings.past || [];
  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
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

  const cancelBooking = (bookingId, e) => {
    e.stopPropagation();
    alert(`Booking ${bookingId} cancellation requested`);
  };

  const handleCompleteClick = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setRating(0);
    setFeedback('');
    setShowRatingPopup(true);
  };

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

  const handleCloseFeedback = () => {
    setShowRatingPopup(false);
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
                      className={`card booking-card ${booking.type}`}
                      onClick={() => navigate(`/${booking.type}/${booking.item.vehicle_id || booking.item._id}`)}
                    >
                      <img
                        src={
                          booking.type === 'room'
                            ? booking.item.images[0]
                            : booking.item.vehicle_images[0]
                        }
                        alt={
                          booking.type === 'room'
                            ? booking.item.roomType
                            : `${booking.item.brand} ${booking.item.model}`
                        }
                        className="card-image"
                      />
                      
                      <div className={`property-badge ${booking.type}`}>
                        {booking.type === 'room'
                          ? booking.item.roomType
                          : booking.item.vehicle_type}
                      </div>
                      
                      <div className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </div>
                      
                      <div className="card-info">
                        <h3>
                          {booking.type === 'room'
                            ? `${booking.item.roomType} at ${booking.item.hotel?.name || 'Unknown'}`
                            : `${booking.item.brand} ${booking.item.model}`}
                        </h3>
                        <p className="location">
                          {booking.type === 'room'
                            ? booking.item.hotel?.city || 'Unknown'
                            : `${booking.item.fuel_type} • ${booking.item.seating_capacity} seats`}
                        </p>

                        <div className="booking-dates">
                          <p>
                            <span>From:</span> {formatDate(booking.startDate)}
                          </p>
                          <p>
                            <span>To:</span> {formatDate(booking.endDate)}
                          </p>
                        </div>

                        <div className="price-action">
                          <div className="price-details">
                            <p className="total-price">Rs {booking.totalPrice.toLocaleString()}</p>
                            <p className="price-breakdown">
                              {booking.type === 'room'
                                ? `for ${calculateDays(booking.startDate, booking.endDate)} nights`
                                : `for ${calculateDays(booking.startDate, booking.endDate)} days`}
                            </p>
                          </div>
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