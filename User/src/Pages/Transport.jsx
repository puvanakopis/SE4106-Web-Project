// React core hooks for component state and effects
import React, { useState, useEffect } from 'react';

// Navigation hook from React Router for page transitions
import { useNavigate } from 'react-router-dom';

// Custom component to render star-based rating
import StarRating from '../Components/Rating/StarRating';

// CSS specific to this Transport component
import './Transport.css';

// Vehicle data used for listing transport items (mocked or static)
import { vehicleData } from '../Assets/assets';

// Icons for heart (like/save), filter toggle, and close button
import { FaHeart, FaRegHeart, FaTimes, FaFilter } from 'react-icons/fa';

// Checkbox component used for filters (vehicle type and price)
const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="filter-checkbox">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      aria-label={label}
    />
    <span className="checkmark"></span>
    <span className="filter-label">{label}</span>
  </label>
);

// Radio button component used for sorting options
const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="filter-radio">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      aria-label={label}
    />
    <span className="radiomark"></span>
    <span className="filter-label">{label}</span>
  </label>
);

const Transport = () => {
  const navigate = useNavigate(); // For navigating to detail page

  // Filter and UI states
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const transportsPerPage = 9; // Number of vehicles shown per page

  // Retrieve saved vehicles from local storage on load
  const [savedVehicles, setSavedVehicles] = useState(() => {
    const saved = localStorage.getItem('savedVehicles');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter and sort options
  const vehicleTypes = ['Motorbike', 'Car', 'Van', 'Bus'];
  const priceRanges = ['0 to 2000', '2000 to 4000', '4000 to 6000'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Seating Capacity'];

  // Auto-hide "Saved" notification after 5 seconds
  useEffect(() => {
    if (showSavedNotification) {
      const timer = setTimeout(() => setShowSavedNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSavedNotification]);

  // Handler for vehicle type filter
  const handleVehicleTypeChange = (checked, label) => {
    setSelectedVehicleTypes((prev) =>
      checked ? [...prev, label] : prev.filter((type) => type !== label)
    );
    setCurrentPage(1); // Reset to first page after filter change
  };

  // Handler for price range filter
  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter((range) => range !== label)
    );
    setCurrentPage(1);
  };

  // Handler for sort option
  const handleSortChange = (label) => {
    setSelectedSortOption(label);
    setCurrentPage(1);
  };

  // Toggle saving or removing a vehicle from saved list
  const toggleSaveVehicle = (vehicleId, e) => {
    e.stopPropagation(); // Prevent card click event
    setSavedVehicles((prev) => {
      const isSaved = prev.includes(vehicleId);
      const newSaved = isSaved
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];

      localStorage.setItem('savedVehicles', JSON.stringify(newSaved));
      if (!isSaved) setShowSavedNotification(true);
      return newSaved;
    });
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedVehicleTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
    setCurrentPage(1);
  };

  // Filter and sort the vehicle data
  const filteredTransports = vehicleData
    .filter((vehicle) => {
      const matchesType =
        selectedVehicleTypes.length === 0 ||
        selectedVehicleTypes.includes(vehicle.vehicle_type);

      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          const [min, max] = range.split(' to ').map(Number);
          return (
            vehicle.rental_price_per_day >= min &&
            vehicle.rental_price_per_day <= max
          );
        });

      return matchesType && matchesPrice;
    })
    .sort((a, b) => {
      switch (selectedSortOption) {
        case 'Price Low to High':
          return a.rental_price_per_day - b.rental_price_per_day;
        case 'Price High to Low':
          return b.rental_price_per_day - a.rental_price_per_day;
        case 'Seating Capacity':
          return b.seating_capacity - a.seating_capacity;
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransports.length / transportsPerPage);
  const startIdx = (currentPage - 1) * transportsPerPage;
  const endIdx = startIdx + transportsPerPage;
  const paginatedTransports = filteredTransports.slice(startIdx, endIdx);

  // Go to specified page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="transport">
      {/* Saved transport notification popup */}
      {showSavedNotification && (
        <div className="save-notification">
          <div className="notification-content">
            <FaHeart className="notification-icon" />
            <span>Transport saved</span>
          </div>
          <button
            className="notification-close"
            onClick={() => setShowSavedNotification(false)}
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Mobile filter toggle */}
      <div className="transport-header">
        <button
          className="mobile-filter-toggle"
          onClick={() => setOpenFilters(!openFilters)}
          aria-expanded={openFilters}
          aria-label={openFilters ? 'Hide filters' : 'Show filters'}
        >
          <FaFilter className="filter-icon" />
          {openFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Overlay for mobile filter sidebar */}
      <div
        className={`filter-overlay ${openFilters ? 'open' : ''}`}
        onClick={() => setOpenFilters(false)}
        aria-hidden="true"
      />

      {/* Main container layout */}
      <div className="transport-container">
        {/* Sidebar with filters */}
        <aside
          className={`filters-sidebar ${openFilters ? 'open' : ''}`}
          aria-label="Filters"
        >
          <button
            className="close-sidebar"
            onClick={() => setOpenFilters(false)}
            aria-label="Close filters"
          >
            &times;
          </button>

          {/* Vehicle type filter */}
          <div className="filter-section">
            <h2 className="filter-section-title">Vehicle Types</h2>
            <div className="filter-options">
              {vehicleTypes.map((vehicle, i) => (
                <CheckBox
                  key={`vehicle-type-${i}`}
                  label={vehicle}
                  selected={selectedVehicleTypes.includes(vehicle)}
                  onChange={handleVehicleTypeChange}
                />
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div className="filter-section">
            <h2 className="filter-section-title">Price Range (per day)</h2>
            <div className="filter-options">
              {priceRanges.map((range, i) => (
                <CheckBox
                  key={`price-range-${i}`}
                  label={range}
                  selected={selectedPriceRanges.includes(range)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
          </div>

          {/* Sort option filter */}
          <div className="filter-section">
            <h2 className="filter-section-title">Sort By</h2>
            <div className="filter-options">
              {sortOptions.map((option, i) => (
                <RadioButton
                  key={`sort-option-${i}`}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>

          {/* Reset filter button */}
          <button
            className="resetButton"
            onClick={resetAllFilters}
            disabled={
              selectedVehicleTypes.length === 0 &&
              selectedPriceRanges.length === 0 &&
              selectedSortOption === ''
            }
            aria-label="Reset all filters"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Main transport cards list */}
        <main className="transports-list">
          {paginatedTransports.length === 0 ? (
            <div className="no-results">
              <h3>No vehicles found matching your criteria</h3>
              <p>Try adjusting your filters to see more results</p>
              <button
                className="reset-filters"
                onClick={resetAllFilters}
                aria-label="Reset filters"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Render transport cards */}
              {paginatedTransports.map((vehicle) => (
                <article
                  key={vehicle.vehicle_id}
                  className="transport-card"
                  onClick={() => navigate(`/transport/${vehicle.vehicle_id}`)}
                  aria-label={`${vehicle.brand} ${vehicle.model}`}
                >
                  <div className="transport-image-container">
                    <img
                      src={vehicle.vehicle_images[0]}
                      alt={`${vehicle.vehicle_type} - ${vehicle.brand} ${vehicle.model}`}
                      className="transport-image"
                    />
                    <span className="transport-badge">{vehicle.vehicle_type}</span>
                    <button
                      className={`save-button ${savedVehicles.includes(vehicle.vehicle_id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSaveVehicle(vehicle.vehicle_id, e)}
                      aria-label={
                        savedVehicles.includes(vehicle.vehicle_id)
                          ? `Unsave ${vehicle.brand} ${vehicle.model}`
                          : `Save ${vehicle.brand} ${vehicle.model}`
                      }
                    >
                      {savedVehicles.includes(vehicle.vehicle_id) ? (
                        <FaHeart className="icon-heart-filled" />
                      ) : (
                        <FaRegHeart className="icon-heart-outline" />
                      )}
                    </button>
                  </div>

                  <div className="transport-card-content">
                    <div className="transport-info">
                      <div className="transport-header-info">
                        <h2 className="transport-title">{vehicle.brand} {vehicle.model}</h2>
                      </div>
                      <div className="transport-specs">
                        <div className="spec-item">
                          <div className="transport-rating">
                            <StarRating rating={vehicle.average_rating} />
                            <span className="reviews">50+ reviews</span>
                          </div>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Fuel:</span>
                          <span className="spec-value">{vehicle.fuel_type}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Seats:</span>
                          <span className="spec-value">{vehicle.seating_capacity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="transport-price-section">
                      <div className="price-info">
                        <p className="price">Rs {vehicle.rental_price_per_day.toLocaleString()}</p>
                        <p className="price-per">per day</p>
                      </div>
                      <button
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/transport/${vehicle.vehicle_id}`);
                        }}
                        aria-label={`View details for ${vehicle.brand} ${vehicle.model}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-arrow"
                    aria-label="Previous page"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => handlePageChange(i + 1)}
                      className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                      aria-label={`Page ${i + 1}`}
                      aria-current={currentPage === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-arrow"
                    aria-label="Next page"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transport;
