import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accommodationsData, vehicleData } from '../../Assets/assets';
import StarRating from '../../Components/Rating/StarRating';
import './Saved.css';

const Saved = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accommodation');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [savedAccommodations, setSavedAccommodations] = useState(() => {
    const saved = localStorage.getItem('savedAccommodations');
    const savedIds = saved ? JSON.parse(saved) : [];
    return accommodationsData.filter(accommodation => savedIds.includes(accommodation._id));
  });

  const [savedTransports, setSavedTransports] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    const savedIds = saved ? JSON.parse(saved) : [];
    return vehicleData.filter(vehicle => savedIds.includes(vehicle.vehicle_id));
  });

  const removeSavedAccommodation = (accommodationId, e) => {
    e.stopPropagation();
    setSavedAccommodations(prev => prev.filter(r => r._id !== accommodationId));
    const saved = JSON.parse(localStorage.getItem('savedAccommodations') || '[]');
    const newSaved = saved.filter(id => id !== accommodationId);
    localStorage.setItem('savedAccommodations', JSON.stringify(newSaved));
  };

  const removeSavedVehicle = (vehicleId, e) => {
    e.stopPropagation();
    setSavedTransports(prev => prev.filter(v => v.vehicle_id !== vehicleId));
    const saved = JSON.parse(localStorage.getItem('savedVehicles') || '[]');
    const newSaved = saved.filter(id => id !== vehicleId);
    localStorage.setItem('savedVehicles', JSON.stringify(newSaved));
  };

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
      <div className="saved-header">
        <div>Your Saved Items</div>
      </div>

      <div className="saved-container">
        <div className="saved-sidebar">
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
          {activeTab === 'accommodation' ? (
            <>
              {savedAccommodations.length === 0 ? (
                <div className="no-saved">
                  <h3>No saved accommodations yet</h3>
                  <p>Save your favorite accommodations by clicking the heart icon</p>
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
                    {paginatedItems.map((accommodation) => (
                      <div
                        key={accommodation._id}
                        className="card accommodation-card"
                        onClick={() => navigate(`/accommodation/${accommodation._id}`)}
                      >
                        <img
                          src={accommodation.images[0]}
                          alt={`${accommodation.accommodationType}`}
                          className="card-image"
                        />
                        <div className="property-badge">{accommodation.accommodationType}</div>
                        <div className="card-info">
                          <h3>{accommodation.accommodationType}</h3>
                          <p>Location – {accommodation.location}</p>
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
                    {paginatedItems.map((vehicle) => (
                      <div
                        key={vehicle.vehicle_id}
                        className={`card vehicle-card ${vehicle.vehicle_type.toLowerCase()}`}
                        onClick={() => navigate(`/transport/${vehicle.vehicle_id}`)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;