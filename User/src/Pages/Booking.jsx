import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsDummyData, vehicleData } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import './Booking.css'; 

const Booking = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  //  data for upcoming bookings
  const upcomingBookings = [
    {
      id: 'b1',
      type: 'room', 
      item: roomsDummyData[0], 
      startDate: '2023-11-15',
      endDate: '2023-11-20',
      status: 'confirmed',
      totalPrice: 75000
    },
    {
      id: 'b1',
      type: 'room', 
      item: roomsDummyData[0], 
      startDate: '2023-11-15',
      endDate: '2023-11-20',
      status: 'confirmed',
      totalPrice: 75000
    },
    {
      id: 'b1',
      type: 'room', 
      item: roomsDummyData[0], 
      startDate: '2023-11-15',
      endDate: '2023-11-20',
      status: 'confirmed',
      totalPrice: 75000
    },
    {
      id: 'b1',
      type: 'room', 
      item: roomsDummyData[0], 
      startDate: '2023-11-15',
      endDate: '2023-11-20',
      status: 'confirmed',
      totalPrice: 75000
    },
    {
      id: 'b2',
      type: 'transport',
      item: vehicleData[1], 
      startDate: '2023-11-18',
      endDate: '2023-11-22',
      status: 'confirmed',
      totalPrice: 12000
    }
  ];

  // data for past bookings
  const pastBookings = [
    {
      id: 'b3',
      type: 'room',
      item: roomsDummyData[2],
      startDate: '2023-09-10',
      endDate: '2023-09-15',
      status: 'completed',
      totalPrice: 60000
    }
  ];

  const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  // Pagination calculations
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format date 
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle booking cancellation
  const cancelBooking = (bookingId, e) => {
    e.stopPropagation(); 
    alert(`Booking ${bookingId} cancellation requested`);
  };

  return (
    <main className="booking-main-container">
      {/* ----------------------------- Main booking container ----------------------------- */}
      <div className="booking-profile">
        
        {/* Page header */}
        <div className="booking-header">
          <div>Your Bookings</div>
        </div>

      
      
        {/* Content area */}
        <div className="booking-container">
          {/*----------------------------- Sidebar navigation tabs ----------------------------- */}
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



          {/* ----------------------------- Main content area ----------------------------- */}
          <div className="booking-content">
            {/* Empty state handling */}
            {bookings.length === 0 ? (
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
                {/* Booking cards grid */}
                <div className="booking-grid">
                  {paginatedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`card booking-card ${booking.type}`}
                      onClick={() => navigate(`/${booking.type}/${booking.item._id || booking.item.vehicle_id}`)}
                    >
                      {/* Booking image */}
                      <img
                        src={
                          booking.type === 'room'
                            ? booking.item.images[0]
                            : booking.item.vehicle_images[0]
                        }
                        alt={
                          booking.type === 'room'
                            ? `${booking.item.roomType} in ${booking.item.hotel.name}`
                            : `${booking.item.brand} ${booking.item.model}`
                        }
                        className="card-image"
                      />
                      
                      {/* Property type badge */}
                      <div className="property-badge">
                        {booking.type === 'room'
                          ? booking.item.roomType
                          : booking.item.vehicle_type}
                      </div>
                      
                      {/* Booking status badge */}
                      <div className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </div>
                      
                      {/* Booking details */}
                      <div className="card-info">
                        <h3>
                          {booking.type === 'room'
                            ? `${booking.item.roomType} at ${booking.item.hotel.name}`
                            : `${booking.item.brand} ${booking.item.model}`}
                        </h3>
                        <p className="location">
                          {booking.type === 'room'
                            ? booking.item.hotel.city
                            : `${booking.item.fuel_type} • ${booking.item.seating_capacity} seats`}
                        </p>

                        {/* Booking dates */}
                        <div className="booking-dates">
                          <p>
                            <span>From:</span> {formatDate(booking.startDate)}
                          </p>
                          <p>
                            <span>To:</span> {formatDate(booking.endDate)}
                          </p>
                        </div>

                        {/* Rating display */}
                        <div className="rating">
                          <StarRating
                            rating={
                              booking.type === 'room'
                                ? booking.item.rating
                                : booking.item.average_rating
                            }
                          />
                          <span>
                            {booking.type === 'room'
                              ? booking.item.review_count || '200+'
                              : booking.item.review_count}{' '}
                            reviews
                          </span>
                        </div>

                        {/* Price and action buttons */}
                        <div className="price-action">
                          <div className="price-details">
                            <p className="total-price">Rs {booking.totalPrice.toLocaleString()}</p>
                            <p className="price-breakdown">
                              {booking.type === 'room'
                                ? `for ${Math.floor(
                                    (new Date(booking.endDate) - new Date(booking.startDate)) /
                                      (1000 * 60 * 60 * 24)
                                  )} nights`
                                : `for ${Math.floor(
                                    (new Date(booking.endDate) - new Date(booking.startDate)) /
                                      (1000 * 60 * 60 * 24)
                                  )} days`}
                            </p>
                          </div>
                          {/* Show cancel button only for upcoming bookings */}
                          {activeTab === 'upcoming' && (
                            <button
                              className="cancel-btn"
                              onClick={(e) => cancelBooking(booking.id, e)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
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
    </main>
  );
};

export default Booking;