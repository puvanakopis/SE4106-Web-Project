import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsDummyData, vehicleData } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import './Saved.css';

const Saved = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transport');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Initialize saved items from localStorage
  const [savedAccommodations, setSavedAccommodations] = useState(() => {
    const saved = localStorage.getItem('savedRooms');
    const savedIds = saved ? JSON.parse(saved) : [];
    return roomsDummyData.filter(room => savedIds.includes(room._id));
  });

  const [savedTransports, setSavedTransports] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    const savedIds = saved ? JSON.parse(saved) : [];
    return vehicleData.filter(vehicle => savedIds.includes(vehicle.vehicle_id));
  });

  // Remove handlers
  const removeSavedAccommodation = (roomId, e) => {
    e.stopPropagation();
    setSavedAccommodations(prev => prev.filter(r => r._id !== roomId));
    const saved = JSON.parse(localStorage.getItem('savedRooms') || '[]');
    const newSaved = saved.filter(id => id !== roomId);
    localStorage.setItem('savedRooms', JSON.stringify(newSaved));
  };

  const removeSavedVehicle = (vehicleId, e) => {
    e.stopPropagation();
    setSavedTransports(prev => prev.filter(v => v.vehicle_id !== vehicleId));
    const saved = JSON.parse(localStorage.getItem('savedVehicles') || '[]');
    const newSaved = saved.filter(id => id !== vehicleId);
    localStorage.setItem('savedVehicles', JSON.stringify(newSaved));
  };

  // Pagination logic
  const totalPages = Math.ceil(
    activeTab === 'transport'
      ? savedTransports.length / itemsPerPage
      : savedAccommodations.length / itemsPerPage
  );

  const paginatedItems = activeTab === 'transport'
    ? savedTransports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : savedAccommodations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="saved-profile">
      {/* Page wrapper for saved items */}

      <div className="saved-header">
        {/* Top header section */}
        <div>Your Saved Items</div>
      </div>

      <div className="saved-container">
        {/* Main container holds sidebar and content */}

        <div className="saved-sidebar">
          {/* Left sidebar for tabs */}
          <div
            onClick={() => {
              setActiveTab('accommodation');
              setCurrentPage(1);
            }}
            className={`saved-title ${activeTab === 'accommodation' ? 'active' : ''}`}
          >
            Accommodations
          </div>
          <div
            onClick={() => {
              setActiveTab('transport');
              setCurrentPage(1);
            }}
            className={`saved-title ${activeTab === 'transport' ? 'active' : ''}`}
          >
            Transport
          </div>
        </div>

        <div className="saved-content">
          {/* Right content panel */}
          {activeTab === 'accommodation' ? (
            <>
              {savedAccommodations.length === 0 ? (
                <div className="no-saved">
                  {/* Message shown when no saved accommodations */}
                  <h3>No saved accommodations yet</h3>
                  <p>Save your favorite rooms by clicking the heart icon</p>
                  <button
                    className="browse-button"
                    onClick={() => navigate('/accommodation')}
                  >
                    Browse Accommodations
                  </button>
                </div>
              ) : (
                <>
                  <div className="saved-grid">
                    {/* Grid layout for saved accommodation cards */}
                    {paginatedItems.map((accommodation) => (
                      <div
                        key={accommodation._id}
                        className="card accommodation-card"
                        onClick={() => navigate(`/room/${accommodation._id}`)}
                      >
                        {/* Single accommodation card */}
                        <img
                          src={accommodation.images[0]}
                          alt={`${accommodation.roomType} in ${accommodation.hotel.name}`}
                          className="card-image"
                        />
                        <div className="property-badge">{accommodation.roomType}</div>
                        <div className="card-info">
                          <h3>{accommodation.roomType} at {accommodation.hotel.name}</h3>
                          <p>Location – {accommodation.hotel.city}</p>
                          <div className="rating">
                            <StarRating rating={accommodation.rating} />
                            <span>{accommodation.review_count || '200+'} reviews</span>
                          </div>
                          <div className="price-action">
                            <p>Rs {accommodation.pricePerMonth.toLocaleString()}/= per month</p>
                            <button
                              className="remove-btn"
                              onClick={(e) => removeSavedAccommodation(accommodation._id, e)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      {/* Pagination controls */}
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
            </>
          ) : (
            <>
              {savedTransports.length === 0 ? (
                <div className="no-saved">
                  {/* Message shown when no saved transports */}
                  <h3>No saved vehicles yet</h3>
                  <p>Save your favorite vehicles by clicking the heart icon</p>
                  <button
                    className="browse-button"
                    onClick={() => navigate('/transport')}
                  >
                    Browse Transport
                  </button>
                </div>
              ) : (
                <>
                  <div className="saved-grid">
                    {/* Grid layout for saved transport cards */}
                    {paginatedItems.map((vehicle) => (
                      <div
                        key={vehicle.vehicle_id}
                        className={`card vehicle-card ${vehicle.vehicle_type.toLowerCase()}`}
                        onClick={() => navigate(`/transport/${vehicle.vehicle_id}`)}
                      >
                        {/* Single vehicle card */}
                        <img
                          src={vehicle.vehicle_images[0]}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="card-image"
                        />
                        <div className="property-badge">{vehicle.vehicle_type}</div>
                        <div className="card-info">
                          <h3>{vehicle.brand} {vehicle.model}</h3>
                          <div className="specs">
                            <p>Fuel – {vehicle.fuel_type}</p>
                            <p>Seats – {vehicle.seating_capacity}</p>
                          </div>
                          <div className="rating">
                            <StarRating rating={vehicle.average_rating} />
                            <span>{vehicle.review_count} reviews</span>
                          </div>
                          <div className="price-action">
                            <p>Rs {vehicle.rental_price_per_day.toLocaleString()}/= per day</p>
                            <button
                              className="remove-btn"
                              onClick={(e) => removeSavedVehicle(vehicle.vehicle_id, e)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      {/* Pagination controls */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;