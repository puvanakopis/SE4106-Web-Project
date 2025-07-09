import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsDummyData, vehicleData } from '../Assets/assets';
import StarRating from '../Components/Rating/StarRating';
import { scrollToTop } from './scrollToTop';
import './Saved.css';

const Saved = () => {
  // ------------------ Routing & State Management ------------------
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accommodation');
  const [currentPage, setCurrentPage] = useState(1);
  const [animateContent, setAnimateContent] = useState(false);
  const itemsPerPage = 6;

  // ------------------ Data Initialization ------------------
  // Initialize saved accommodations from localStorage
  const [savedAccommodations, setSavedAccommodations] = useState(() => {
    const saved = localStorage.getItem('savedRooms');
    const savedIds = saved ? JSON.parse(saved) : [];
    return roomsDummyData.filter(room => savedIds.includes(room._id));
  });

  // Initialize saved transports from localStorage
  const [savedTransports, setSavedTransports] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    const savedIds = saved ? JSON.parse(saved) : [];
    return vehicleData.filter(vehicle => savedIds.includes(vehicle.vehicle_id));
  });

  // ------------------ Animation Effects ------------------
  // Trigger animation when tab changes
  useEffect(() => {
    setAnimateContent(true);
    const timer = setTimeout(() => setAnimateContent(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // ------------------ Item Removal Handlers ------------------
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

  // ------------------ Pagination Logic ------------------
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

  // ------------------ Event Handlers ------------------
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    scrollToTop();
  };

  return (
    <div className="saved-profile fade-in">
      {/* ------------------ Header Section ------------------ */}
      <div className="saved-header slide-in-left delay-100">
        <div>Your Saved Items</div>
      </div>

      {/* ------------------ Main Content Container ------------------ */}
      <div className="saved-container fade-in delay-200">
        {/* ------------------ Sidebar Navigation ------------------ */}
        <div className="saved-sidebar slide-in-left delay-300">
          <div
            onClick={() => handleTabChange('accommodation')}
            className={`saved-title ${activeTab === 'accommodation' ? 'active' : ''}`}
          >
            Accommodations
          </div>
          <div
            onClick={() => handleTabChange('transport')}
            className={`saved-title ${activeTab === 'transport' ? 'active' : ''}`}
          >
            Transport
          </div>
        </div>

        {/* ------------------ Content Display Area ------------------ */}
        <div className={`saved-content ${animateContent ? 'slide-in-right' : ''}`}>
          {activeTab === 'accommodation' ? (
            <>
              {savedAccommodations.length === 0 ? (
                <div className="no-saved fade-in delay-100">
                  <h3>No saved accommodations yet</h3>
                  <p>Save your favorite rooms by clicking the heart icon</p>
                  <button
                    className="browse-button fade-in delay-200"
                    onClick={() => { navigate('/accommodation'); scrollToTop(); }}
                  >
                    Browse Accommodations
                  </button>
                </div>
              ) : (
                <>
                  {/* ------------------ Accommodation Grid ------------------ */}
                  <div className="saved-grid">
                    {paginatedItems.map((accommodation, index) => (
                      <div
                        key={accommodation._id}
                        className={`card accommodation-card fade-in delay-${(index % 6) + 1}00`}
                        onClick={() => { navigate(`/room/${accommodation._id}`); scrollToTop(); }}
                      >
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

                  {/* ------------------ Pagination Controls ------------------ */}
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
            </>
          ) : (
            <>
              {savedTransports.length === 0 ? (
                <div className="no-saved fade-in delay-100">
                  <h3>No saved vehicles yet</h3>
                  <p>Save your favorite vehicles by clicking the heart icon</p>
                  <button
                    className="browse-button fade-in delay-200"
                    onClick={() => { navigate('/transport'); scrollToTop(); }}
                  >
                    Browse Transport
                  </button>
                </div>
              ) : (
                <>
                  {/* ------------------ Transport Grid ------------------ */}
                  <div className="saved-grid">
                    {paginatedItems.map((vehicle, index) => (
                      <div
                        key={vehicle.vehicle_id}
                        className={`card vehicle-card ${vehicle.vehicle_type.toLowerCase()} fade-in delay-${(index % 6) + 1}00`}
                        onClick={() => { navigate(`/transport/${vehicle.vehicle_id}`); scrollToTop(); }}
                      >
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

                  {/* ------------------ Pagination Controls ------------------ */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;