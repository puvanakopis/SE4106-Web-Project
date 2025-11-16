import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Feedback from './Feedback';
import StarRating from '../../Components/Rating/StarRating';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('confirmed');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Separate state variables for each booking type
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  const itemsPerPage = 6;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [isLoggedIn, navigate, user?.id]);

  // Fetch bookings from API and store in separate state variables
  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      // Fetch transport bookings
      const transportResponse = await fetch(`http://localhost:5000/api/transport-bookings/renter/${user.id}`);
      const transportData = await transportResponse.json();

      // Fetch accommodation bookings
      const accommodationResponse = await fetch(`http://localhost:5000/api/accommodationsbookings/renter/${user.id}`);
      let accommodationData = { bookings: [] };

      if (accommodationResponse.ok) {
        accommodationData = await accommodationResponse.json();
      }

      const roomBookings = accommodationData.bookings || [];
      const vehicleBookings = transportData.bookings || transportData.data?.bookings || [];

      // Process and separate bookings by status
      const { confirmed, completed, cancelled } = processBookingsData(roomBookings, vehicleBookings);
      
      setConfirmedBookings(confirmed);
      setCompletedBookings(completed);
      setCancelledBookings(cancelled);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Reset all bookings on error
      setConfirmedBookings([]);
      setCompletedBookings([]);
      setCancelledBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Process bookings data and separate by status
  const processBookingsData = (roomBookings, vehicleBookings) => {
    const confirmed = [];
    const completed = [];
    const cancelled = [];

    // Process room bookings
    roomBookings.forEach(booking => {
      const bookingData = createBookingData(booking, 'room');
      categorizeBooking(bookingData, confirmed, completed, cancelled);
    });

    // Process vehicle bookings
    vehicleBookings.forEach(booking => {
      const bookingData = createBookingData(booking, 'vehicle');
      categorizeBooking(bookingData, confirmed, completed, cancelled);
    });

    return { confirmed, completed, cancelled };
  };

  // Create standardized booking data
  const createBookingData = (booking, type) => {
    return {
      id: booking._id || booking.id,
      type: type,
      item: booking.accommodation || booking.transport || booking.vehicle || booking.room || booking.item || {},
      owner: booking.owner || {},
      renter: booking.renter || {},
      startDate: booking.booking_start || booking.startDate,
      endDate: booking.booking_end || booking.endDate,
      totalPrice: booking.totalPrice || booking.price || 0,
      status: (booking.booking_status || booking.status || 'confirmed').toLowerCase(),
      isPaid: booking.isPaid || false,
      rating: booking.rating || booking.review?.rating,
      feedback: booking.feedback || booking.review?.comment
    };
  };

  // Categorize booking into appropriate array
  const categorizeBooking = (bookingData, confirmed, completed, cancelled) => {
    if (bookingData.status === 'completed') {
      completed.push(bookingData);
    } else if (bookingData.status === 'cancelled') {
      cancelled.push(bookingData);
    } else {
      confirmed.push(bookingData);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, type, status, reviewData = null) => {
    try {
      if (type === 'room') {
        const endpoint = `/api/accommodations/bookings/${bookingId}`;
        const updateData = { booking_status: status };

        if (reviewData) {
          updateData.rating = reviewData.rating;
          updateData.feedback = reviewData.feedback;
        }

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) throw new Error('Failed to update booking');
      } else {
        if (reviewData) {
          const reviewResponse = await fetch(`/api/transport-bookings/${bookingId}/review`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rating: reviewData.rating,
              comment: reviewData.feedback
            })
          });

          if (!reviewResponse.ok) throw new Error('Failed to submit review');
        }

        if (status === 'completed') {
          const statusResponse = await fetch(`/api/transport-bookings/${bookingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ booking_status: status })
          });

          if (!statusResponse.ok) throw new Error('Failed to update booking status');
        }
      }

      // Refresh all bookings after update
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  // Get current bookings based on active tab
  const currentBookings = useMemo(() => {
    switch (activeTab) {
      case 'confirmed':
        return confirmedBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return cancelledBookings;
      default:
        return confirmedBookings;
    }
  }, [activeTab, confirmedBookings, completedBookings, cancelledBookings]);

  // Pagination
  const totalPages = Math.ceil(currentBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    return currentBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentBookings, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    if (typeof dateString === 'object') {
      if (dateString instanceof Date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return dateString.toLocaleDateString(undefined, options);
      }
      return 'Invalid Date';
    }

    if (typeof dateString === 'string') {
      const parsed = new Date(dateString);
      if (isNaN(parsed.getTime())) return 'Invalid Date';

      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return parsed.toLocaleDateString(undefined, options);
    }

    return 'N/A';
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = typeof startDate === 'object' && !(startDate instanceof Date)
      ? new Date()
      : new Date(startDate);
    const end = typeof endDate === 'object' && !(endDate instanceof Date)
      ? new Date()
      : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const cancelBooking = async (bookingId, type, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(bookingId, type, 'cancelled');
        alert('Booking cancelled successfully');
      } catch (error) {
        alert('Failed to cancel booking. Please try again.');
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const handleCompleteClick = (booking, e) => {
    e.stopPropagation();

    if (booking.status !== 'confirmed') {
      alert('Only confirmed bookings can be completed');
      return;
    }

    setSelectedBooking(booking);
    setRating(booking.rating || 0);
    setFeedback(booking.feedback || '');
    setShowRatingPopup(true);
  };

  const handleRatingSubmit = async (ratingData) => {
    if (!selectedBooking) return;

    setIsSubmitting(true);
    try {
      await updateBookingStatus(selectedBooking.id, selectedBooking.type, 'completed', {
        rating: ratingData.rating,
        feedback: ratingData.feedback
      });
      setShowRatingPopup(false);
      setSelectedBooking(null);
      setRating(0);
      setFeedback('');
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
    setSelectedBooking(null);
    setRating(0);
    setFeedback('');
  };

  // CORRECTED: Proper image URL construction
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/default-vehicle.jpg'; // Fallback image
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If it starts with /uploads/, prepend the backend URL
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }

    // If it's just a filename, assume it's in the uploads directory
    if (!imagePath.includes('/')) {
      return `http://localhost:5000/uploads/transports/${imagePath}`;
    }

    // Return as is for other cases
    return imagePath;
  };

  // Booking card data processing
  const processBookingCardData = (booking) => {
    const isRoom = booking.type === 'room';

    // CORRECTED: Image processing with proper URL construction
    const getImage = () => {
      if (isRoom) {
        const roomImage = booking.item.images?.[0];
        return roomImage ? getImageUrl(roomImage) : '/default-room.jpg';
      } else {
        const vehicleImage = booking.item.vehicle_images?.[0] || booking.item.images?.[0];
        return vehicleImage ? getImageUrl(vehicleImage) : '/default-vehicle.jpg';
      }
    };

    // Title processing
    const getTitle = () => {
      if (isRoom) {
        return `${booking.item.roomType || 'Room'} at ${booking.item.roomName || booking.item.name || 'Unknown'}`;
      } else {
        return `${booking.item.brand || ''} ${booking.item.model || ''}`.trim() || 'Vehicle';
      }
    };

    // Review count processing
    const getReviewCount = () => {
      const reviewCount = booking.item.totalReviews || booking.item.reviewCount || 0;
      if (typeof reviewCount === 'object') return 0;
      const count = Number(reviewCount);
      return isNaN(count) ? 0 : count;
    };

    // Vehicle type processing
    const getVehicleType = () => {
      return booking.item.vehicle_type || booking.item.type || 'vehicle';
    };

    return {
      image: getImage(),
      title: getTitle(),
      reviewCount: getReviewCount(),
      vehicleType: getVehicleType(),
      isRoom,
      averageRating: booking.item.averageRating || booking.item.rating || 0
    };
  };

  // CORRECTED: Image error handler
  const handleImageError = (e, isRoom) => {
    e.target.src = isRoom ? '/default-room.jpg' : '/default-vehicle.jpg';
  };

  if (loading) {
    return (
      <div className="booking-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-profile">
      {/* Page Title */}
      <div className="booking-header">
        <div>My Bookings</div>
      </div>

      {/* Navigation Tabs */}
      <div className="booking-container">
        <div className='booking-sidebar'>
          <button
            className={`booking-title ${activeTab === 'confirmed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('confirmed');
              setCurrentPage(1);
            }}
          >
            Confirmed Bookings ({confirmedBookings.length})
          </button>
          <button
            className={`booking-title ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('completed');
              setCurrentPage(1);
            }}
          >
            Completed Bookings ({completedBookings.length})
          </button>
          <button
            className={`booking-title ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('cancelled');
              setCurrentPage(1);
            }}
          >
            Cancelled Bookings ({cancelledBookings.length})
          </button>
        </div>

        <div className='booking-content'>
          {/* Confirmed Bookings View */}
          {activeTab === 'confirmed' && (
            <div className="bookings-list">
              {/* Bookings List Header */}
              <div className="list-header">
                <h2 className='section-title'>Confirmed Bookings ({confirmedBookings.length})</h2>
                <div className="search-filter">
                  <input className='search-input' type="text" placeholder="Search bookings..." />
                  <select>
                    <option>All Types</option>
                    <option value="room">Accommodation</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
              </div>

              {confirmedBookings.length === 0 ? (
                <div className="no-bookings">
                  <h3>No confirmed bookings found</h3>
                  <p>You don't have any confirmed bookings yet.</p>
                  <button
                    className="browse-button"
                    onClick={() => navigate('/room')}
                  >
                    Browse Accommodations
                  </button>
                  <button
                    className="browse-button"
                    onClick={() => navigate('/transport')}
                  >
                    Browse Vehicles
                  </button>
                </div>
              ) : (
                <>
                  <div className='booking-grid'>
                    {paginatedBookings.map((booking) => {
                      const cardData = processBookingCardData(booking);

                      return (
                        <div
                          key={`${booking.type}-${booking.id}`}
                          className={`card ${booking.type === 'room' ? 'accommodation-card' : 'vehicle-card'}`}
                          onClick={() => navigate(`/${booking.type === 'room' ? 'accommodation' : 'transport'}/${booking.item._id || booking.item.id}`)}
                        >
                          <div className="card-image-container">
                            <img
                              src={cardData.image}
                              alt={cardData.title}
                              className="card-image"
                              onError={(e) => handleImageError(e, cardData.isRoom)}
                            />
                            <div className="property-badge">
                              {cardData.isRoom
                                ? booking.item.roomType || 'Accommodation'
                                : cardData.vehicleType}
                            </div>
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="card-info">
                            <h3 className="card-title">{cardData.title}</h3>

                            <div className="booking-dates">
                              <div className="card-detail">
                                <span className="detail-label">From:</span>
                                <span className="detail-value">{formatDate(booking.startDate)}</span>
                              </div>
                              <div className="card-detail">
                                <span className="detail-label">To:</span>
                                <span className="detail-value">{formatDate(booking.endDate)}</span>
                              </div>
                              <div className="card-detail">
                                <span className="detail-label">Duration:</span>
                                <span className="detail-value">
                                  {calculateDays(booking.startDate, booking.endDate)} {cardData.isRoom ? 'nights' : 'days'}
                                </span>
                              </div>
                            </div>

                            <div className="price-section">
                              <div className="total-price">Rs {booking.totalPrice?.toLocaleString()}</div>
                              <div className="price-note">Total amount</div>
                            </div>

                            <div className="action-buttons">
                              <button
                                className="cancel-btn"
                                onClick={(e) => cancelBooking(booking.id, booking.type, e)}
                              >
                                Cancel Booking
                              </button>
                              <button
                                className="complete-btn"
                                onClick={(e) => handleCompleteClick(booking, e)}
                              >
                                Mark Complete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          )}

          {/* Completed Bookings View */}
          {activeTab === 'completed' && (
            <div className="bookings-list">
              {/* Bookings List Header */}
              <div className="list-header">
                <h2 className='section-title'>Completed Bookings ({completedBookings.length})</h2>
                <div className="search-filter">
                  <input className='search-input' type="text" placeholder="Search bookings..." />
                  <select>
                    <option>All Types</option>
                    <option value="room">Accommodation</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
              </div>

              {completedBookings.length === 0 ? (
                <div className="no-bookings">
                  <h3>No completed bookings found</h3>
                  <p>You haven't completed any bookings yet.</p>
                </div>
              ) : (
                <>
                  <div className="booking-grid">
                    {paginatedBookings.map((booking) => {
                      const cardData = processBookingCardData(booking);

                      return (
                        <div
                          key={`${booking.type}-${booking.id}`}
                          className={`card ${booking.type === 'room' ? 'accommodation-card' : 'vehicle-card'}`}
                          onClick={() => navigate(`/${booking.type === 'room' ? 'accommodation' : 'transport'}/${booking.item._id || booking.item.id}`)}
                        >
                          <div className="card-image-container">
                            <img
                              src={cardData.image}
                              alt={cardData.title}
                              className="card-image"
                              onError={(e) => handleImageError(e, cardData.isRoom)}
                            />
                            <div className="property-badge">
                              {cardData.isRoom
                                ? booking.item.roomType || 'Accommodation'
                                : cardData.vehicleType}
                            </div>
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="card-info">
                            <h3 className="card-title">{cardData.title}</h3>

                            <div className="booking-dates">
                              <div className="card-detail">
                                <span className="detail-label">Booked from:</span>
                                <span className="detail-value">{formatDate(booking.startDate)} to {formatDate(booking.endDate)}</span>
                              </div>
                              <div className="card-detail">
                                <span className="detail-label">Rs {booking.totalPrice?.toLocaleString()}</span>
                                <span className="detail-value">Amount paid</span>
                              </div>
                            </div>

                            {booking.rating ? (
                              <div className="past-rating">
                                <div className="card-detail">
                                  <span className="detail-label">Your Rating:</span>
                                  <div className="star-rating">
                                    <StarRating rating={booking.rating} />
                                  </div>
                                </div>
                                {booking.feedback && (
                                  <div className="feedback-section">
                                    <span className="detail-label">Your Feedback:</span>
                                    <p className="feedback-text">"{booking.feedback}"</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="no-rating">
                                <p>No rating provided</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
          )}

          {/* Cancelled Bookings View */}
          {activeTab === 'cancelled' && (
            <div className="bookings-list">
              {/* Bookings List Header */}
              <div className="list-header">
                <h2 className='section-title'>Cancelled Bookings ({cancelledBookings.length})</h2>
                <div className="search-filter">
                  <input className='search-input' type="text" placeholder="Search bookings..." />
                  <select>
                    <option>All Types</option>
                    <option value="room">Accommodation</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
              </div>

              {cancelledBookings.length === 0 ? (
                <div className="no-bookings">
                  <h3>No cancelled bookings found</h3>
                  <p>You haven't cancelled any bookings yet.</p>
                </div>
              ) : (
                <>
                  <div className="booking-grid">
                    {paginatedBookings.map((booking) => {
                      const cardData = processBookingCardData(booking);

                      return (
                        <div
                          key={`${booking.type}-${booking.id}`}
                          className={`card cancelled-booking ${booking.type === 'room' ? 'accommodation-card' : 'vehicle-card'}`}
                          onClick={() => navigate(`/${booking.type === 'room' ? 'accommodation' : 'transport'}/${booking.item._id || booking.item.id}`)}
                        >
                          <div className="card-image-container">
                            <img
                              src={cardData.image}
                              alt={cardData.title}
                              className="card-image"
                              onError={(e) => handleImageError(e, cardData.isRoom)}
                            />
                            <div className="property-badge">
                              {cardData.isRoom
                                ? booking.item.roomType || 'Accommodation'
                                : cardData.vehicleType}
                            </div>
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="card-info">
                            <h3 className="card-title">{cardData.title}</h3>

                            <div className="booking-dates">
                              <div className="card-detail">
                                <span className="detail-label">Was booked for:</span>
                                <span className="detail-value">{formatDate(booking.startDate)} to {formatDate(booking.endDate)}</span>
                              </div>
                              <div className="card-detail">
                                <span className="detail-label cancelled-price">Rs {booking.totalPrice?.toLocaleString()}</span>
                                <span className="detail-value">Booking amount</span>
                              </div>
                            </div>

                            <div className="cancelled-notice">
                              <p>This booking has been cancelled</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          )}
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
    </div>
  );
};

export default Booking;