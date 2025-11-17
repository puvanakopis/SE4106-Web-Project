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
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [updateTransportLoading, setUpdateTransportLoading] = useState({});
  const [updateAccommodationLoading, setUpdateAccommodationLoading] = useState({});
  const [reviewError, setReviewError] = useState('');
  const [updateError, setUpdateError] = useState('');

  const itemsPerPage = 6;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [isLoggedIn, navigate, user?.id]);

  // Get all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      // Fetch transport bookings
      const transportResponse = await fetch(`http://localhost:5000/api/transport-bookings/renter/${user.id}`);
      const transportData = await transportResponse.json();

      // Fetch accommodation bookings
      const accommodationResponse = await fetch(`http://localhost:5000/api/accommodation-bookings/renter/${user.id}`);
      let accommodationData = { bookings: [] };

      if (accommodationResponse.ok) {
        accommodationData = await accommodationResponse.json();
      }

      const roomBookings = accommodationData.bookings || [];
      const vehicleBookings = transportData.bookings || transportData.data?.bookings || [];

      const { confirmed, completed, cancelled } = processBookingsData(roomBookings, vehicleBookings);
      
      setConfirmedBookings(confirmed);
      setCompletedBookings(completed);
      setCancelledBookings(cancelled);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setConfirmedBookings([]);
      setCompletedBookings([]);
      setCancelledBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Process bookings data
  const processBookingsData = (roomBookings, vehicleBookings) => {
    const confirmed = [];
    const completed = [];
    const cancelled = [];

    // Process accommodation bookings
    roomBookings.forEach(booking => {
      const bookingData = createBookingData(booking, 'accommodation');
      categorizeBooking(bookingData, confirmed, completed, cancelled);
    });

    // Process transport bookings
    vehicleBookings.forEach(booking => {
      const bookingData = createBookingData(booking, 'transport');
      categorizeBooking(bookingData, confirmed, completed, cancelled);
    });

    return { confirmed, completed, cancelled };
  };

  // Create standardized booking data
  const createBookingData = (booking, type) => {
    const isAccommodation = type === 'accommodation';
    
    // Handle different field names between accommodation and transport bookings
    const reviewRating = booking.review?.rating;
    const reviewComment = booking.review?.comment;
    
    const item = isAccommodation ? booking.accommodation : booking.transport;
    const owner = booking.owner || {};
    const renter = booking.renter || {};

    return {
      id: booking._id || booking.id,
      type: type,
      item: item || {},
      owner: owner,
      renter: renter,
      startDate: booking.booking_start || booking.startDate,
      endDate: booking.booking_end || booking.endDate,
      totalPrice: booking.totalPrice || booking.price || 0,
      status: (booking.booking_status || booking.status).toLowerCase(),
      isPaid: booking.isPaid || false,
      rating: reviewRating,
      feedback: reviewComment,
      numberOfGuests: booking.numberOfGuests,
      securityDeposit: booking.securityDeposit,
      paymentMethod: booking.paymentMethod,
      specialRequests: booking.specialRequests,
      originalData: booking
    };
  };

  const categorizeBooking = (bookingData, confirmed, completed, cancelled) => {
    if (bookingData.status === 'completed') {
      completed.push(bookingData);
    } else if (bookingData.status === 'cancelled') {
      cancelled.push(bookingData);
    } else {
      // Consider 'confirmed' as confirmed for display
      confirmed.push(bookingData);
    }
  };

  // Add review to accommodation booking
  const addAccommodationReview = async (bookingId, reviewData) => {
    try {
      setReviewError('');

      const response = await fetch(`http://localhost:5000/api/accommodation-bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.feedback
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding accommodation review:', error);
      setReviewError(error.message);
      throw error;
    }
  };

  // Add review to transport booking
  const addTransportReview = async (bookingId, reviewData) => {
    try {
      setReviewError('');

      const response = await fetch(`http://localhost:5000/api/transport-bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.feedback
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding transport review:', error);
      setReviewError(error.message);
      throw error;
    }
  };

  // Update accommodation booking status
  const updateAccommodationBookingStatus = async (bookingId, status, cancellationReason = '') => {
    try {
      setUpdateAccommodationLoading(prev => ({ ...prev, [bookingId]: true }));
      setUpdateError('');

      let endpoint = `http://localhost:5000/api/accommodation-bookings/${bookingId}`;
      let method = 'PUT';
      let body = { booking_status: status };

      // For cancellation, use PATCH method with cancellation reason
      if (status === 'cancelled') {
        endpoint = `http://localhost:5000/api/accommodation-bookings/${bookingId}/cancel`;
        method = 'PATCH';
        body = { cancellationReason };
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update accommodation booking status');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating accommodation booking:', error);
      setUpdateError(error.message);
      throw error;
    } finally {
      setUpdateAccommodationLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  // Update transport booking status
  const updateTransportBookingStatus = async (bookingId, status) => {
    try {
      setUpdateTransportLoading(prev => ({ ...prev, [bookingId]: true }));
      setUpdateError('');

      const response = await fetch(`http://localhost:5000/api/transport-bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          booking_status: status 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transport booking status');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating transport booking:', error);
      setUpdateError(error.message);
      throw error;
    } finally {
      setUpdateTransportLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  // Complete booking with review
  const completeBookingWithReview = async (bookingId, type, reviewData) => {
    try {
      setIsSubmitting(true);
      
      if (type === 'accommodation') {
        // First update status to completed
        await updateAccommodationBookingStatus(bookingId, 'completed');
        
        // Then add review if provided
        if (reviewData.rating > 0) {
          await addAccommodationReview(bookingId, reviewData);
        }
      } else {
        // First update status to completed
        await updateTransportBookingStatus(bookingId, 'completed');
        
        // Then add review if provided
        if (reviewData.rating > 0) {
          await addTransportReview(bookingId, reviewData);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error completing booking with review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete booking without review
  const completeBookingWithoutReview = async (bookingId, type) => {
    try {
      setIsSubmitting(true);
      
      if (type === 'accommodation') {
        await updateAccommodationBookingStatus(bookingId, 'completed');
      } else {
        await updateTransportBookingStatus(bookingId, 'completed');
      }
      
      return true;
    } catch (error) {
      console.error('Error completing booking without review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
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

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating days:', error);
      return 0;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId, type, e) => {
    e.stopPropagation();
    
    const cancellationReason = prompt('Please provide a reason for cancellation:');
    if (!cancellationReason) return;
    
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        if (type === 'accommodation') {
          await updateAccommodationBookingStatus(bookingId, 'cancelled', cancellationReason);
        } else {
          await updateTransportBookingStatus(bookingId, 'cancelled');
        }
        
        await fetchBookings();
        alert('Booking cancelled successfully');
      } catch (error) {
        alert('Failed to cancel booking. Please try again.');
        console.error('Error cancelling booking:', error);
      }
    }
  };

  // Handle complete click - show rating popup
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

  // Handle rating submission
  const handleRatingSubmit = async (ratingData) => {
    if (!selectedBooking) return;

    setIsSubmitting(true);
    setReviewError('');

    try {
      // If user provided rating/feedback, complete with review
      if (ratingData.rating > 0) {
        await completeBookingWithReview(selectedBooking.id, selectedBooking.type, {
          rating: ratingData.rating,
          feedback: ratingData.feedback
        });
        alert('Thank you for your feedback!');
      } else {
        // If no rating provided, just complete the booking
        await completeBookingWithoutReview(selectedBooking.id, selectedBooking.type);
        alert('Booking marked as completed!');
      }
      
      await fetchBookings();
      setShowRatingPopup(false);
      setSelectedBooking(null);
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error completing booking:', error);
      alert(reviewError || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowRatingPopup(false);
    setSelectedBooking(null);
    setRating(0);
    setFeedback('');
    setReviewError('');
  };

  // Image URL construction
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/default-image.jpg';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }

    if (!imagePath.includes('/')) {
      return `http://localhost:5000/uploads/${imagePath}`;
    }

    return imagePath;
  };

  // Booking card data processing
  const processBookingCardData = (booking) => {
    const isAccommodation = booking.type === 'accommodation';

    const getImage = () => {
      if (isAccommodation) {
        const accommodationImage = booking.item.accommodation_images?.[0];
        return accommodationImage ? getImageUrl(accommodationImage) : '/default-room.jpg';
      } else {
        const vehicleImage = booking.item.vehicle_images?.[0] || booking.item.images?.[0];
        return vehicleImage ? getImageUrl(vehicleImage) : '/default-vehicle.jpg';
      }
    };

    const getTitle = () => {
      if (isAccommodation) {
        return booking.item.roomName || booking.item.name || 'Accommodation';
      } else {
        return `${booking.item.brand || ''} ${booking.item.model || ''}`.trim() || 'Vehicle';
      }
    };

    const getSubtitle = () => {
      if (isAccommodation) {
        return `${booking.item.roomType || 'Room'} • ${booking.item.location || 'Unknown Location'}`;
      } else {
        return `${booking.item.vehicle_type || 'Vehicle'} • ${booking.item.transmission || 'Auto'}`;
      }
    };

    const getPropertyType = () => {
      if (isAccommodation) {
        return booking.item.roomType || 'Accommodation';
      } else {
        return booking.item.vehicle_type || 'Vehicle';
      }
    };

    return {
      image: getImage(),
      title: getTitle(),
      subtitle: getSubtitle(),
      propertyType: getPropertyType(),
      isAccommodation,
      averageRating: booking.item.averageRating || booking.item.rating || 0,
      reviewCount: booking.item.totalReviews || booking.item.reviewCount || 0
    };
  };

  const handleImageError = (e, isAccommodation) => {
    e.target.src = isAccommodation ? '/default-room.jpg' : '/default-vehicle.jpg';
  };

  // Check if booking is currently being updated
  const isBookingUpdating = (bookingId, type) => {
    if (type === 'accommodation') {
      return updateAccommodationLoading[bookingId] || false;
    } else {
      return updateTransportLoading[bookingId] || false;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-profile">
      {/* Error Display */}
      {(reviewError || updateError) && (
        <div className="error-banner">
          {reviewError && <p>Review Error: {reviewError}</p>}
          {updateError && <p>Update Error: {updateError}</p>}
          <button onClick={() => { setReviewError(''); setUpdateError(''); }}>Dismiss</button>
        </div>
      )}

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
              <div className="list-header">
                <h2 className='section-title'>Confirmed Bookings ({confirmedBookings.length})</h2>
                <div className="search-filter">
                  <input className='search-input' type="text" placeholder="Search bookings..." />
                  <select>
                    <option>All Types</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transport">Vehicle</option>
                  </select>
                </div>
              </div>

              {confirmedBookings.length === 0 ? (
                <div className="no-bookings">
                  <h3>No confirmed bookings found</h3>
                  <p>You don't have any confirmed bookings yet.</p>
                  <div className="browse-buttons">
                    <button
                      className="browse-button"
                      onClick={() => navigate('/accommodation')}
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
                </div>
              ) : (
                <>
                  <div className='booking-grid'>
                    {paginatedBookings.map((booking) => {
                      const cardData = processBookingCardData(booking);
                      const isUpdating = isBookingUpdating(booking.id, booking.type);

                      return (
                        <div
                          key={`${booking.type}-${booking.id}`}
                          className={`card ${booking.type === 'accommodation' ? 'accommodation-card' : 'vehicle-card'} ${isUpdating ? 'updating' : ''}`}
                          onClick={() => !isUpdating && navigate(`/${booking.type === 'accommodation' ? 'accommodation' : 'transport'}/${booking.item._id || booking.item.id}`)}
                        >
                          {isUpdating && (
                            <div className="updating-overlay">
                              <div className="loading-spinner-small"></div>
                              <p>Updating...</p>
                            </div>
                          )}

                          <div className="card-image-container">
                            <img
                              src={cardData.image}
                              alt={cardData.title}
                              className="card-image"
                              onError={(e) => handleImageError(e, cardData.isAccommodation)}
                            />
                            <div className="property-badge">
                              {cardData.propertyType}
                            </div>
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="card-info">
                            <h3 className="card-title">{cardData.title}</h3>
                            <p className="card-subtitle">{cardData.subtitle}</p>

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
                                  {calculateDays(booking.startDate, booking.endDate)} {'days'}
                                </span>
                              </div>
                              {booking.numberOfGuests && (
                                <div className="card-detail">
                                  <span className="detail-label">Guests:</span>
                                  <span className="detail-value">{booking.numberOfGuests}</span>
                                </div>
                              )}
                            </div>

                            <div className="price-section">
                              <div className="total-price">Rs {booking.totalPrice?.toLocaleString()}</div>
                              <div className="price-note">Total amount</div>
                            </div>

                            <div className="action-buttons">
                              <button
                                className="cancel-btn"
                                onClick={(e) => cancelBooking(booking.id, booking.type, e)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? 'Cancelling...' : 'Cancel Booking'}
                              </button>
                              <button
                                className="complete-btn"
                                onClick={(e) => handleCompleteClick(booking, e)}
                                disabled={isUpdating}
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
              <div className="list-header">
                <h2 className='section-title'>Completed Bookings ({completedBookings.length})</h2>
                <div className="search-filter">
                  <input className='search-input' type="text" placeholder="Search bookings..." />
                  <select>
                    <option>All Types</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transport">Vehicle</option>
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
                          className={`card ${booking.type === 'accommodation' ? 'accommodation-card' : 'vehicle-card'}`}
                          onClick={() => navigate(`/${booking.type === 'accommodation' ? 'accommodation' : 'transport'}/${booking.item._id || booking.item.id}`)}
                        >
                          <div className="card-image-container">
                            <img
                              src={cardData.image}
                              alt={cardData.title}
                              className="card-image"
                              onError={(e) => handleImageError(e, cardData.isAccommodation)}
                            />
                            <div className="property-badge">
                              {cardData.propertyType}
                            </div>
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="card-info">
                            <h3 className="card-title">{cardData.title}</h3>
                            <p className="card-subtitle">{cardData.subtitle}</p>

                            <div className="booking-dates">
                              <div className="card-detail">
                                <span className="detail-label">Booked from:</span>
                                <span className="detail-value">{formatDate(booking.startDate)} to {formatDate(booking.endDate)}</span>
                              </div>
                              <div className="card-detail">
                                <span className="detail-label">Amount paid:</span>
                                <span className="detail-value">Rs {booking.totalPrice?.toLocaleString()}</span>
                              </div>
                            </div>

                            {booking.rating ? (
                              <div className="past-rating">
                                <div className="card-detail">
                                  <span className="detail-label">Your Rating:</span>
                                  <div className="star-rating">
                                    <StarRating rating={booking.rating} />
                                    <span className="rating-value">({booking.rating}/5)</span>
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
              <div className="list-header">
                <h2 className='section-title'>Cancelled Bookings ({cancelledBookings.length})</h2>
                <div className="search-filter">
                  <input className='search-input' type="text" placeholder="Search bookings..." />
                  <select>
                    <option>All Types</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transport">Vehicle</option>
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
                          className={`card cancelled-booking ${booking.type === 'accommodation' ? 'accommodation-card' : 'vehicle-card'}`}
                          onClick={() => navigate(`/${booking.type === 'accommodation' ? 'accommodation' : 'transport'}/${booking.item._id || booking.item.id}`)}
                        >
                          <div className="card-image-container">
                            <img
                              src={cardData.image}
                              alt={cardData.title}
                              className="card-image"
                              onError={(e) => handleImageError(e, cardData.isAccommodation)}
                            />
                            <div className="property-badge">
                              {cardData.propertyType}
                            </div>
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="card-info">
                            <h3 className="card-title">{cardData.title}</h3>
                            <p className="card-subtitle">{cardData.subtitle}</p>

                            <div className="booking-dates">
                              <div className="card-detail">
                                <span className="detail-label">Was booked for:</span>
                                <span className="detail-value">{formatDate(booking.startDate)} to {formatDate(booking.endDate)}</span>
                              </div>
                              <div className="card-detail">
                                <span className="detail-label cancelled-price">Booking amount:</span>
                                <span className="detail-value">Rs {booking.totalPrice?.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="cancelled-notice">
                              <p>This booking has been cancelled</p>
                              {booking.originalData.cancellationReason && (
                                <p className="cancellation-reason">
                                  Reason: {booking.originalData.cancellationReason}
                                </p>
                              )}
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

      {/* Rating Popup */}
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